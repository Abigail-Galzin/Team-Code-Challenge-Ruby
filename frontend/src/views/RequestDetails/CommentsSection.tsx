import { useEffect, useState } from "react";
import { Avatar } from "../../components/common/Avatar";
import { Button } from "../../components/common/Button";
import { Dropdown } from "../../components/form/Dropdown";
import { TextArea } from "../../components/form/TextArea";
import { Alert } from "../../components/feedback/Alert";
import { createComment } from "../../services/commentsApi";
import { searchTeamMembers } from "../../services/teamMembersApi";
import type { Comment, TeamMemberSearchResult } from "../../types";
import { formatDate } from "../../utils/format";
import "./CommentsSection.css";

export interface CommentsSectionProps {
  supportRequestId: number;
  comments: Comment[];
  onCommentAdded: (comment: Comment) => void;
}

export function CommentsSection({ supportRequestId, comments, onCommentAdded }: CommentsSectionProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMemberSearchResult[]>([]);
  const [authorId, setAuthorId] = useState("");
  const [body, setBody] = useState("");
  const [authorError, setAuthorError] = useState("");
  const [bodyError, setBodyError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    searchTeamMembers("")
      .then(setTeamMembers)
      .catch(() => setTeamMembers([]));
  }, []);

  const authorOptions = teamMembers.map((member) => ({
    label: `${member.name} (${member.email})`,
    value: String(member.id),
  }));

  function handleSubmit() {
    const trimmedBody = body.trim();
    const author = teamMembers.find((member) => String(member.id) === authorId);

    setAuthorError(author ? "" : "Select who is commenting");
    setBodyError(trimmedBody.length >= 10 ? "" : "Comment must be at least 10 characters");

    if (!author || trimmedBody.length < 10) {
      return;
    }

    setSubmitError("");
    setSubmitting(true);

    createComment(supportRequestId, { body: trimmedBody, author_email: author.email })
      .then((response) => {
        onCommentAdded(response.data);
        setBody("");
      })
      .catch((error) => {
        const data = error?.response?.data;
        const message = Array.isArray(data?.error) ? data.error.join(", ") : data?.error;
        setSubmitError(message ?? "Unable to add the comment.");
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  return (
    <div className="comments-section">
      {comments.length === 0 ? (
        <p className="comments-empty">No comments yet.</p>
      ) : (
        <ul className="comments-list">
          {comments.map((comment) => (
            <li key={comment.id} className="comments-list-item">
              <Avatar name={comment.team_member.name} size="sm" />
              <div className="comments-list-item-content">
                <div className="comments-list-item-header">
                  <span className="comments-list-item-author">{comment.team_member.name}</span>
                  <span className="comments-list-item-date">{formatDate(comment.created_at)}</span>
                </div>
                <p className="comments-list-item-body">{comment.body}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="comments-form">
        {submitError && <Alert variant="error">{submitError}</Alert>}
        <Dropdown
          label="Comment as"
          options={authorOptions}
          value={authorId}
          onChange={setAuthorId}
          placeholder="Select a team member"
          error={authorError}
        />
        <TextArea
          label="Comment"
          rows={3}
          value={body}
          onChange={setBody}
          error={bodyError}
          placeholder="Add a comment..."
        />
        <div className="comments-form-actions">
          <Button onClick={handleSubmit} loading={submitting}>
            Add Comment
          </Button>
        </div>
      </div>
    </div>
  );
}

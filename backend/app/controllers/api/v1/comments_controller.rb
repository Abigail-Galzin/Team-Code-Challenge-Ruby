module Api
  module V1
    class CommentsController < ApplicationController
      before_action :find_support_request

      def create
        return render json: { error: "not found the team member" }, status: :not_found unless team_member_reference_valid?

        comment = @support_request.comments.build(comment_params)

        if comment.save
          resp = Response::ResponseData.new(
            data: comment.as_json(except: [ :author_email, :updated_at ], include: { team_member: { only: :name } }),
            message: "The comment was created",
            status: :created
          )
          render json: resp.as_json, status: resp.status
        else
          render json: { error: comment.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def comment_params
        params.require(:comment).permit(:body, :author_email)
      end

      def find_support_request
        @support_request = SupportRequest.find(params[:support_request_id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "not found support request" }, status: :not_found
      end

      def team_member_reference_valid?
        TeamMember.active.exists?(email: comment_params[:author_email])
      end
    end
  end
end

module Api
  module V1
    class SupportRequestsController < ApplicationController
      before_action :find_support_request, only: [:show, :update]

      def show
        resp = Response::ResponseData.new(
          data: @support_request.as_json(
            methods: [:overdue],
            include: {
              team_member: { only: [:active, :email, :name, :role] },
              comments: { except: [:author_email, :updated_at], include: { team_member: { only: :name } } },
            }
          ),
          message: "Support request was found",
          status: :ok
        )
        render json: resp.as_json, status: resp.status
      end

      def index
        pagy, records = pagy(filtered_support_requests, limit_max: 10)
        resp = Response::ResponseData.new(
            data: records.as_json(except: [:created_at, :updated_at], methods: [:overdue], include: { team_member: { only: [:active,:email,:name,:role,]}}),
            message:"The support request return correctly",
            status: :ok
          )
        render json: resp.as_json.merge(Response::ResponsePaginationInfo.new(pagy).as_json), status: resp.status
      end

      def create
        return render json: { error: "not found the team member" }, status: :not_found unless team_member_reference_valid?

        support_request = SupportRequest.new(support_requests_params)

        if support_request.save
          resp = Response::ResponseData.new(
            data: support_request,
            message: "The support request was created",
            status: :created
          )
          render json: resp.as_json, status: resp.status
        else
          render json: { error: support_request.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        return render json: { error: "not found the team member" }, status: :not_found unless team_member_reference_valid?

        if @support_request.update(support_requests_params)
          resp = Response::ResponseData.new(
            data: @support_request,
            message:"The support request was updated",
            status: :ok
          )
          render json: resp.as_json, status: resp.status
        else
          render json: { error: @support_request.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private 

      def support_requests_params
        params.require(:support_request).permit(:title, :description, :status, :priority, :due_date, :completed_at, :team_member_id)
      end


      def find_support_request
          @support_request = SupportRequest.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "not found support request" }, status: :not_found
      end

      def team_member_reference_valid?
        team_member_id = support_requests_params[:team_member_id]
        team_member_id.blank? || TeamMember.active.exists?(team_member_id)
      end

      def filtered_support_requests
        scope = SupportRequest.includes(:team_member)
        scope = scope.by_status(params[:status]) if params[:status].present?
        scope = scope.by_priority(params[:priority]) if params[:priority].present?
        scope = scope.assigned_to(params[:team_member_id]) if params[:team_member_id].present?
        scope = scope.unassigned if params[:unassigned] == "true"
        scope = scope.overdue if params[:overdue] == "true"
        scope = scope.search_by_title(params[:q]) if params[:q].present?
        scope
      end

    end
  end
end



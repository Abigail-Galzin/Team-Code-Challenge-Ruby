module Api
  module V1
    class TeamMembersController < ApplicationController
      def index
        team_members = TeamMember.active
        if params[:q].present?
          team_members = team_members.where(
            "name ILIKE :q OR email ILIKE :q", q: "%#{params[:q]}%"
          )
        end

        resp = Response::ResponseData.new(
          data: team_members.as_json(only: [:id, :name, :email, :role, :active]),
          message: "The team members return correctly",
          status: :ok
        )
        render json: resp.as_json, status: resp.status
      end
    end
  end
end

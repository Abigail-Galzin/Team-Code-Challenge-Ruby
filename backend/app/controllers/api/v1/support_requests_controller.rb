module Api
  module V1
    class SupportRequestsController < ApplicationController
      def index
        pagy, records = pagy(SupportRequest.includes(:team_member), client_max_limit: 10)
        resp = Response::ResponseData.new(
            data: records.as_json(except: [:created_at, :updated_at], include: { team_member: { only: [:active,:email,:name,:role,]}}),
            message:"The support request return correctly",
            status: :ok
          )
        render json: resp.as_json.merge(Response::ResponsePaginationInfo.new(pagy).as_json), status: resp.status
      end

    end
  end
end



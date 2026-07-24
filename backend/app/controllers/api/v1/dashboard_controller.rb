module Api
  module V1
    class DashboardController < ApplicationController
      def index
        resp = Response::ResponseData.new(
          data: {
            total_requests: SupportRequest.count,
            overdue_requests: SupportRequest.overdue.count,
            unassigned_requests: SupportRequest.unassigned.count,
            requests_by_status: counts_by_status,
            requests_by_priority: counts_by_priority,
          },
          message: "Dashboard stats returned correctly",
          status: :ok
        )
        render json: resp.as_json, status: resp.status
      end

      private

      def counts_by_status
        SupportRequest.statuses.keys.index_with(0).merge(SupportRequest.group(:status).count)
      end

      def counts_by_priority
        SupportRequest.priorities.keys.index_with(0).merge(SupportRequest.group(:priority).count)
      end
    end
  end
end

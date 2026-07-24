module Response
  class ResponsePaginationInfo
    def initialize(pagy_data)
      @pagy_data = pagy_data
    end

    def as_json(*)
      {
        pagination:{ 
            page: @pagy_data.page,
            pages: @pagy_data.pages,
            count: @pagy_data.count,
            limit: @pagy_data.limit,
            next: @pagy_data.next,
            prev: @pagy_data.prev
          }
      }
    end
  end
end

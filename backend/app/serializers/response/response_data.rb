class Response::ResponseData
  attr_reader :data, :message, :status

  def initialize(data: nil, message: nil, status: :ok)
    @data = data
    @message = message
    @status = status
  end

  def as_json(*)
    { message: message, data: data, status: status }
  end
end

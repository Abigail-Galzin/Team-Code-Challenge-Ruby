class Api::V1::TeamMembersController < ApplicationController
  before_action :set_team_member, only: %i[show update]

  # GET /api/v1/team_members
  def index
    team_members = TeamMember.includes(:support_requests).order(created_at: :desc)

    query_params = request.query_parameters
    team_members = team_members.by_active(query_params[:active])
      .by_role(query_params[:role])
      .search_by_name(query_params[:name])

    pagy, records = pagy(team_members, limit: 10)

    response = Response::ResponseData.new(
      data: records.as_json(
        except: [:created_at, :updated_at],
        include: { support_requests: { only: [:title, :status, :priority]}}
      ),
      message: I18n.t('success.response', model: TeamMember.model_name.human.pluralize),
      status: :ok
    )

    render json: response.as_json.merge(Response::ResponsePaginationInfo.new(pagy).as_json),
      status: response.status
  end

  # GET /api/v1/team_members/:id
  def show
    response = Response::ResponseData.new(
      data: @team_member.as_json(include: { support_requests: { only: [:title, :status, :priority]}}),
      message: I18n.t('success.response', model: TeamMember.model_name.human),
      status: :ok
    )

    render json: response.as_json, status: response.status
  end

  # POST /api/v1/team_members
  def create
    team_member = TeamMember.new(team_member_params)

    if team_member.save
      response = Response::ResponseData.new(
        data: team_member.as_json(include: { support_requests: { only: [:title, :status, :priority]}}),
        message: I18n.t('success.response', model: TeamMember.model_name.human),
        status: :created
      )

      render json: response.as_json, status: response.status
    else
      render json: { errors: team_member.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PUT/PATCH /api/v1/team_members/:id
  def update
    if @team_member.update(team_member_params)
      response = Response::ResponseData.new(
        data: @team_member.as_json(include: { support_requests: { only: [:title, :status, :priority]}}),
        message: I18n.t('success.response', model: TeamMember.model_name.human),
        status: :ok
      )

      render json: response.as_json, status: response.status
    else
      render json: { errors: @team_member.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_team_member
    @team_member = TeamMember.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Team member not found" }, status: :not_found
  end

  def team_member_params
    params.require(:team_member).permit(:name, :email, :role, :active)
  end
end

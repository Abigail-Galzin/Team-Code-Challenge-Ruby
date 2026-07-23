class Api::V1::TeamMembersController < ApplicationController
  before_action :set_team_member, only: %i[show update destroy]

  # GET /api/v1/team_members
  def index
    team_members = TeamMember.all.order(created_at: :desc)
    render json: team_members, status: :ok
  end

  # GET /api/v1/team_members/:id
  def show
    render json: @team_member, status: :ok
  end

  # POST /api/v1/team_members
  def create
    team_member = TeamMember.new(team_member_params)

    if team_member.save
      render json: team_member, status: :created
    else
      render json: { errors: team_member.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PUT/PATCH /api/v1/team_members/:id
  def update
    if @team_member.update(team_member_params)
      render json: @team_member, status: :ok
    else
      render json: { errors: @team_member.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/team_members/:id
  def destroy
    @team_member.destroy
    head :no_content # Retorna status 204 sin cuerpo
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

FactoryBot.define do
  factory :comment do
    transient do
      team_member { create(:team_member) }
    end

    body { Faker::Lorem.sentence(word_count: 6) }
    support_request
    author_email { team_member.email }
  end
end

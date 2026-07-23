FactoryBot.define do
  factory :support_request do
    title { Faker::Lorem.sentence }
    description { Faker::Lorem.paragraph }
    status { "open" }
    priority { "medium" }
    due_date { 1.week.from_now.to_date }
    team_member { nil }

    trait :in_progress do
      status { "in_progress" }
    end

    trait :resolved do
      status { "resolved" }
    end

    trait :closed do
      status { "closed" }
    end
  end
end

FactoryBot.define do
  factory :team_member do
    name { Faker::Name.name }
    email { Faker::Internet.unique.email }
    role { :developer }
    active { true }

    trait :inactive do
      active { false }
    end

    trait :qa do
      role { :qa }
    end

    trait :support do
      role { :support }
    end
  end
end

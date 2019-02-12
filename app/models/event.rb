class Event < ApplicationRecord
  has_many :registrations
  has_many :users, through: :registrations
  has_many :guests, through: :registrations

  validates :title, :description, presence: true, length: { minimum: 3 }
end
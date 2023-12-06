/**
 * @module NameUtils
 */

/**
 * @file Used for generating random expense names
 */

const ADJECTIVES = `Good
First
Last
Long
Freat
Little
Own
Other
Old
Right
Big
High
Different
Small
Large
Next
Early
Young
Important
Few
Public
Bad
Same
Able`.split('\n');

const NOUNS = `time
year
people
way
day
man
thing
woman
life
child
world
school
state
family
student
group
country
problem
hand
part
place
case
week
company
system
program
question
work
government
number
night
point
home
water
room
mother
area
money
story
fact
month
lot
right
study
book
eye
job
word
business
issue
side
kind
head
house
service
friend
father
power
hour
game
line
end
member
law
car
city
community
name
president
team
minute
idea
kid
body
information
back
parent
face
others
level
office
door
health
person
art
war
history
party
result
change
morning
reason
research
girl
guy
moment
air
teacher
force
education`.split('\n');

/**
 * Generates a random expense name
 * @returns {string} A name for an expense made of an adjective and noun
 */
const generateRandomName = () => {
    const adjectiveIndex = Math.floor(Math.random() * ADJECTIVES.length);
    const nounIndex = Math.floor(Math.random() * NOUNS.length);
    return `${ADJECTIVES[adjectiveIndex]} ${NOUNS[nounIndex]}`;
};

export { generateRandomName };

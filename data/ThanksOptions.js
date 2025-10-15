const thanksOptionsProfessional = [
  { tag: "Used for an adoptable pet" },
  { tag: "Pet adopted with this" },
  {
    tag: "Inspiration for what I wrote for an adoptable pet",
  },
  {
    tag: "Inspiration for what I wrote for an adoptable pet and they were adopted",
  },
];

const thanksOptionsPetOwners = [
  { tag: "Used for personal pet" },
  {
    tag: "Inspiration for a personal pet's name",
  },
];

const thanksOptionsAnyone = [
  { tag: "Made me smile or laugh" },

  { tag: "I just really, really liked this" },
  {
    tag: "That pun/rhyme/meme/ect hit the spot",
  },
  { tag: "Clever!" },
];

const thanksOptions = [
  ...thanksOptionsProfessional,
  ...thanksOptionsPetOwners,
  ...thanksOptionsAnyone,
];
export {
  thanksOptionsProfessional,
  thanksOptionsPetOwners,
  thanksOptionsAnyone,
  thanksOptions,
};

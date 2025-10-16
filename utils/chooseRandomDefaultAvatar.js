export default function chooseRandomDefaultAvatar() {
  const defaultAvatars = [
    "/avatar-fish.png",
    "/avatar-fox.png",
    "/avatar-giraffe.png",
    "/avatar-llama.png",
    "/avatar-panda.png",
    "/avatar-tiger.png",
    "/avatar-whale.png",
  ];

  // Pick a random one
  const randomAvatar =
    defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

  return randomAvatar;
}

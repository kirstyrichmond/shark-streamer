import { Avatar } from "../store/slices/userSlice";
import redCharacter from "../Images/avatars/default/red-character.jpg";
import blueCharacter from "../Images/avatars/default/blue-character.jpg";
import greenCharacter from "../Images/avatars/default/green-character.jpg";
import yellowCharacter from "../Images/avatars/default/yellow-character.jpg";
import superheroCharacter from "../Images/avatars/default/superhero-character.jpg";
import penguinCharacter from "../Images/avatars/default/penguin-character.jpg";
import kidsAvatar1 from "../Images/avatars/kids/kids-avatar-1.jpg";
import kidsAvatar2 from "../Images/avatars/kids/kids-avatar-2.jpg";
import kidsAvatar3 from "../Images/avatars/kids/kids-avatar-3.jpg";
import kidsAvatar4 from "../Images/avatars/kids/kids-avatar-4.jpg";
import kidsAvatar5 from "../Images/avatars/kids/kids-avatar-5.jpg";
import kidsAvatar6 from "../Images/avatars/kids/kids-avatar-6.jpg";

export const defaultAvatars: Avatar[] = [
  { id: "default-1", name: "Red Character", image_url: redCharacter, url: redCharacter, category: "default" },
  { id: "default-2", name: "Blue Character", image_url: blueCharacter, url: blueCharacter, category: "default" },
  { id: "default-3", name: "Green Character", image_url: greenCharacter, url: greenCharacter, category: "default" },
  { id: "default-4", name: "Yellow Character", image_url: yellowCharacter, url: yellowCharacter, category: "default" },
  { id: "default-5", name: "Superhero Character", image_url: superheroCharacter, url: superheroCharacter, category: "default" },
  { id: "default-6", name: "Penguin Character", image_url: penguinCharacter, url: penguinCharacter, category: "default" },
];

export const kidsAvatars: Avatar[] = [
  { id: "kids-1", name: "Kids Avatar 1", image_url: kidsAvatar1, url: kidsAvatar1, category: "kids" },
  { id: "kids-2", name: "Kids Avatar 2", image_url: kidsAvatar2, url: kidsAvatar2, category: "kids" },
  { id: "kids-3", name: "Kids Avatar 3", image_url: kidsAvatar3, url: kidsAvatar3, category: "kids" },
  { id: "kids-4", name: "Kids Avatar 4", image_url: kidsAvatar4, url: kidsAvatar4, category: "kids" },
  { id: "kids-5", name: "Kids Avatar 5", image_url: kidsAvatar5, url: kidsAvatar5, category: "kids" },
  { id: "kids-6", name: "Kids Avatar 6", image_url: kidsAvatar6, url: kidsAvatar6, category: "kids" },
];

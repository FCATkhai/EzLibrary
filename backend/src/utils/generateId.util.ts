import { customAlphabet } from "nanoid";
import { ALPHABET } from "../config/constants";

const generateId = () => {
    return customAlphabet(ALPHABET, 6)();
}

export default generateId;
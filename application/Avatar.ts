import { GetInitials, IsColourDark, StringToColor } from "./UtilityFunctions";


export interface IAvatarInformation {
    // Name inside the avatar
    name: string,
    // The avatar background colour
    background: string,
    // The foreground colour
    forecolor: string
}

/**
 * Generate an avatar object to be used for rendering
 * @param  {string} displayName The user's display name
 * @returns IAvatarInformation  The generated avatar object data for rendering
 */
export function GetAvatarColors(displayName: string): IAvatarInformation {
    let name = GetInitials(displayName).toUpperCase();
    let background = StringToColor(displayName);
    let forecolor = IsColourDark(background) ? '#FFFFFF' : '#000000';

    return { name, background, forecolor }
}
/**
 * Check if the string is empty (null/undef) or it only contains spaces (whitespace)
 * 
 * @example "Hello  " -> false, "" -> true, "     " -> true
 * @param  {string} str input string
 * @returns boolean     If the string is empty or whitespaced
 */
export function StringIsEmptyOrWhitespaced(str: string){
    return str === undefined || str === null || str.match(/^ *$/) !== null;
}

/**
 * Generate a colour using a string
 * 
 * @param  {string} str The input string
 * @returns string      A generated HEX color with hash prefix.
 */
export function StringToColor(str: string): string {
    // Generate a hash from the string using its characters
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Turn the hash into a color (RGB)
    var colour = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }

    return colour;
}

/**
 * Get the initials of a name which has several parts seperated by a space.
 * @param  {string} string  A human name
 * @returns string          The initials
 */
export function GetInitials(string: string): string {
    if (string == null) {
        console.error("GetInitials -> Null!");
        return "";
    }

    // Split the string by a space
    var names = string.split(' '),
        initials = names[0].substring(0, 1).toUpperCase();
    
    // If we have more then one name (space seperated)
    // like First Middle Last, get each name and add the first character
    // Joseph Mid Cartino - JMC
    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
};

/**
 * Check if a colour is dark
 * @param  {any} colour
 * @returns boolean If the colour is dark
 */
export function IsColourDark(colour: any): boolean {
    // Variables for red, green, blue values
    var r, g, b, hsp;
    
    // If we are using hex then convert the color to RGB
    colour = +("0x" + colour.slice(1).replace( 
    colour.length < 5 && /./g, '$&$&'));

    r = colour >> 16;
    g = colour >> 8 & 255;
    b = colour & 255;
    
    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
        0.299 * (r * r) +
        0.587 * (g * g) +
        0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    if (hsp>127.5) return false; // light
    else return true; // dark
}


/**
 * Limit a string to a length and add a elipse at the end.
 * 
 * Example usage:  TruncateString("Hello World", 7, "...")
 * Example return: "Hell..."
 * @param  {string} string      The input string
 * @param  {number} length      The length of the desired string
 * @param  {} delimiter         The string split delimiter 
 */
export function TruncateString(string: string, length: number = 100, delimiter = null) {
    if (string === undefined || string === null) return "";
    let delim = delimiter || "&hellip;";
    return string.length > length ? string.substr(0, length) + delim : string;
};
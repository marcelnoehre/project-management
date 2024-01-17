const defaultColors = ['#FF0000', '#00FF00', '#0000FF', '#FFA500', '#FFFFFF'];

function defaultColor() {
    return defaultColors[Math.floor(Math.random() * defaultColors.length)];
}

function generateInitials(fullName) {
    const fullNameArr = fullName.split(/\s+/);
    const first = fullNameArr[0].charAt(0).toUpperCase();
    const second = fullNameArr.length > 1 ? fullNameArr[1]?.charAt(0).toUpperCase() : ''
    return first + second;
}

module.exports = { 
    generateInitials,
    defaultColor
};
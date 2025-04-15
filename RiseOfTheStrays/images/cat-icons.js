// SVG icons for cat types
const catIcons = {
    // Scavenger cat - resourceful cat with a backpack
    'Scavenger': `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50">
        <!-- Cat body -->
        <ellipse cx="50" cy="55" rx="25" ry="20" fill="#a0a0a0"/>
        <!-- Cat head -->
        <circle cx="50" cy="35" r="15" fill="#a0a0a0"/>
        <!-- Cat ears -->
        <polygon points="40,25 35,15 45,20" fill="#a0a0a0"/>
        <polygon points="60,25 65,15 55,20" fill="#a0a0a0"/>
        <!-- Cat eyes -->
        <ellipse cx="43" cy="33" rx="3" ry="4" fill="#ffffff"/>
        <ellipse cx="57" cy="33" rx="3" ry="4" fill="#ffffff"/>
        <circle cx="43" cy="33" r="1.5" fill="#000000"/>
        <circle cx="57" cy="33" r="1.5" fill="#000000"/>
        <!-- Cat nose -->
        <polygon points="50,38 48,41 52,41" fill="#ff9999"/>
        <!-- Cat mouth -->
        <path d="M46,43 Q50,46 54,43" fill="none" stroke="#000000" stroke-width="1"/>
        <!-- Backpack -->
        <rect x="30" y="45" width="15" height="20" rx="2" ry="2" fill="#8B4513"/>
        <rect x="32" y="48" width="11" height="3" rx="1" ry="1" fill="#A52A2A"/>
        <rect x="32" y="53" width="11" height="3" rx="1" ry="1" fill="#A52A2A"/>
        <!-- Backpack straps -->
        <path d="M30,50 Q40,40 50,50" fill="none" stroke="#8B4513" stroke-width="2"/>
    </svg>`,
    
    // Hunter cat - cat with a bow and arrow
    'Hunter': `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50">
        <!-- Cat body -->
        <ellipse cx="50" cy="55" rx="25" ry="20" fill="#d2691e"/>
        <!-- Cat head -->
        <circle cx="50" cy="35" r="15" fill="#d2691e"/>
        <!-- Cat ears -->
        <polygon points="40,25 35,15 45,20" fill="#d2691e"/>
        <polygon points="60,25 65,15 55,20" fill="#d2691e"/>
        <!-- Cat eyes -->
        <ellipse cx="43" cy="33" rx="3" ry="4" fill="#ffffff"/>
        <ellipse cx="57" cy="33" rx="3" ry="4" fill="#ffffff"/>
        <circle cx="43" cy="33" r="1.5" fill="#000000"/>
        <circle cx="57" cy="33" r="1.5" fill="#000000"/>
        <!-- Cat nose -->
        <polygon points="50,38 48,41 52,41" fill="#ff9999"/>
        <!-- Cat mouth -->
        <path d="M46,43 Q50,46 54,43" fill="none" stroke="#000000" stroke-width="1"/>
        <!-- Bow -->
        <path d="M70,45 Q80,55 70,65" fill="none" stroke="#8B4513" stroke-width="2"/>
        <line x1="70" y1="55" x2="50" y2="55" stroke="#8B4513" stroke-width="2"/>
        <!-- Arrow -->
        <line x1="50" y1="55" x2="30" y2="55" stroke="#A52A2A" stroke-width="1.5"/>
        <polygon points="30,55 33,53 33,57" fill="#A52A2A"/>
    </svg>`,
    
    // Guardian cat - cat with a shield
    'Guardian': `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50">
        <!-- Cat body -->
        <ellipse cx="50" cy="55" rx="25" ry="20" fill="#696969"/>
        <!-- Cat head -->
        <circle cx="50" cy="35" r="15" fill="#696969"/>
        <!-- Cat ears -->
        <polygon points="40,25 35,15 45,20" fill="#696969"/>
        <polygon points="60,25 65,15 55,20" fill="#696969"/>
        <!-- Cat eyes -->
        <ellipse cx="43" cy="33" rx="3" ry="4" fill="#ffffff"/>
        <ellipse cx="57" cy="33" rx="3" ry="4" fill="#ffffff"/>
        <circle cx="43" cy="33" r="1.5" fill="#000000"/>
        <circle cx="57" cy="33" r="1.5" fill="#000000"/>
        <!-- Cat nose -->
        <polygon points="50,38 48,41 52,41" fill="#ff9999"/>
        <!-- Cat mouth -->
        <path d="M46,43 Q50,46 54,43" fill="none" stroke="#000000" stroke-width="1"/>
        <!-- Shield -->
        <path d="M30,50 Q30,70 50,75 Q70,70 70,50 Q70,45 50,40 Q30,45 30,50 Z" fill="#C0C0C0" stroke="#808080" stroke-width="2"/>
        <path d="M50,45 L50,70" stroke="#808080" stroke-width="1"/>
        <path d="M40,50 L60,50" stroke="#808080" stroke-width="1"/>
    </svg>`,
    
    // Medic cat - cat with a medical cross
    'Medic': `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50">
        <!-- Cat body -->
        <ellipse cx="50" cy="55" rx="25" ry="20" fill="#ffffff"/>
        <!-- Cat head -->
        <circle cx="50" cy="35" r="15" fill="#ffffff"/>
        <!-- Cat ears -->
        <polygon points="40,25 35,15 45,20" fill="#ffffff"/>
        <polygon points="60,25 65,15 55,20" fill="#ffffff"/>
        <!-- Cat eyes -->
        <ellipse cx="43" cy="33" rx="3" ry="4" fill="#ffffff"/>
        <ellipse cx="57" cy="33" rx="3" ry="4" fill="#ffffff"/>
        <circle cx="43" cy="33" r="1.5" fill="#000000"/>
        <circle cx="57" cy="33" r="1.5" fill="#000000"/>
        <!-- Cat nose -->
        <polygon points="50,38 48,41 52,41" fill="#ff9999"/>
        <!-- Cat mouth -->
        <path d="M46,43 Q50,46 54,43" fill="none" stroke="#000000" stroke-width="1"/>
        <!-- Medical cross -->
        <rect x="40" y="50" width="20" height="20" rx="2" ry="2" fill="#ff0000"/>
        <rect x="45" y="45" width="10" height="30" rx="2" ry="2" fill="#ff0000"/>
    </svg>`
};

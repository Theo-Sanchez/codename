import React from 'react';

const Loader = () => {
    return (
        <div class="loader">
        <svg class="circular">
            <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/>
        </svg>
        </div>
    );
}

export default Loader;

import React from 'react';

const app = (props)=>(
<div
    style = {{
        color: 'white',
        background: props.bg
    }}
>
    { props.children }
</div>
);

module.exports = app;
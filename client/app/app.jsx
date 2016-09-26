import React from 'react';

const app = (props)=>(
<div
    style = {{
        background: props.bg
    }}
>
    { props.children }
</div>
);

module.exports = app;
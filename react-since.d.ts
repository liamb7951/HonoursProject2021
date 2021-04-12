import React, * as react from 'react';

declare module 'react-since' {
    export interface ISinceProps {
        live?: boolean,
        date: string|Date,
        seconds?: number
    }

    export class Since extends React.Component<ISinceProps, any> {
        getSince(): string;
    }
}
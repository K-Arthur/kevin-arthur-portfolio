import { Partytown } from '@builder.io/partytown/react';

export function PartytownSetup() {
    return (
        <Partytown debug={process.env.NODE_ENV === 'development'} forward={['dataLayer.push']} />
    );
}

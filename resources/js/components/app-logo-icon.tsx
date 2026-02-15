import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/logo-bella-forme.svg"
            alt="Bella Forme"
            {...props}
        />
    );
}

/*!
 * @copyright FLYACTS GmbH 2019
 */


export type MediaActionOptions =
| ResizeActionOptions;


/** Options for the media variant action resize */
export class ResizeActionOptions {
    public constructor(
        public width: number,
        public height: number,
    ) {}
}

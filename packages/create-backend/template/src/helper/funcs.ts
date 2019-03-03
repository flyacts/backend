/*!
 * @copyright FLYACTS GmbH 2018
 */

/**
 * Checks if the sortfield is in the valid sort fields
 */
export function hasValidSortField(sortField?: string, validSortFields: string[] = []): sortField is string {
    if (typeof sortField === 'undefined') {
        return false;
    }

    return validSortFields.includes(sortField);
}

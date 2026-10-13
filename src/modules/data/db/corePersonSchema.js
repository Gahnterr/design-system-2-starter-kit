/**
 * Reference attribute schema for the Core Person Verato domain.
 * Read-only: used to describe what each cluster contains, never modified.
 *
 * Top-level keys are clusters. An attribute's value is either a type
 * (TEXT, NUMBER, DATE, DATE-TIME, TIME, BOOLEAN, CODE_SET) or, when it is an
 * object, a nested cluster.
 */
export const CORE_PERSON_SCHEMA = {
    names: {
        use: 'CODE_SET',
        prefix: 'TEXT',
        first: 'TEXT',
        middle: 'TEXT',
        last: 'TEXT',
        suffix: 'TEXT',
        credential: 'TEXT'
    },
    addresses: {
        type: 'CODE_SET',
        line1: 'TEXT',
        line2: 'TEXT',
        city: 'TEXT',
        district: 'TEXT',
        state: 'TEXT',
        postalCode: 'TEXT',
        country: 'TEXT',
        latitude: 'NUMBER',
        longitude: 'NUMBER',
        validFrom: 'DATE',
        validTo: 'DATE'
    },
    datesOfBirth: {
        dateOfBirth: 'DATE'
    },
    ssns: {
        ssn: 'TEXT'
    },
    genders: {
        gender: 'CODE_SET'
    },
    genderIdentities: {
        genderIdentity: 'CODE_SET'
    },
    phoneNumbers: {
        type: 'CODE_SET',
        countryCode: 'TEXT',
        areaCode: 'TEXT',
        number: 'TEXT',
        extension: 'TEXT',
        validTo: 'DATE',
        validFrom: 'DATE',
        bestTimeToContact: {
            day: 'CODE_SET',
            startTime: 'TIME',
            endTime: 'TIME',
            allDay: 'BOOLEAN'
        }
    },
    emails: {
        type: 'CODE_SET',
        email: 'TEXT',
        validFrom: 'DATE',
        validTo: 'DATE'
    },
    deathDetails: {
        deceased: 'CODE_SET',
        dateOfDeath: 'DATE-TIME',
        city: 'TEXT',
        county: 'TEXT',
        state: 'TEXT',
        country: 'TEXT'
    },
    externalUniqueIdentifier: {
        issuer: 'TEXT',
        value: 'TEXT',
        status: 'TEXT',
        startDate: 'DATE',
        endDate: 'DATE'
    },
    alternateIdentifiers: {
        description: 'TEXT',
        type: 'CODE_SET',
        value: 'TEXT',
        status: 'TEXT',
        issuer: 'TEXT',
        issueDate: 'DATE',
        startDate: 'DATE',
        endDate: 'DATE'
    },
    multipleBirthIndicator: {
        multipleBirthIndicator: 'BOOLEAN',
        multipleBirthInteger: 'NUMBER',
        birthPlurality: 'NUMBER'
    },
    citizenships: {
        citizenship: 'CODE_SET'
    },
    photos: {
        url: 'TEXT'
    },
    sexualOrientations: {
        sexualOrientation: 'CODE_SET'
    },
    races: {
        race: 'CODE_SET'
    },
    ethnicities: {
        ethnicity: 'CODE_SET'
    },
    religiousAffiliations: {
        religiousAffiliation: 'CODE_SET'
    },
    maritalStatuses: {
        maritalStatus: 'CODE_SET'
    },
    communicationLanguages: {
        language: 'CODE_SET',
        preferred: 'BOOLEAN'
    },
    qualifications: {
        type: 'CODE_SET',
        qualification: 'CODE_SET',
        status: 'CODE_SET',
        issuer: 'TEXT',
        issueDate: 'DATE',
        validFrom: 'DATE',
        validTo: 'DATE'
    },
    consents: {
        name: 'TEXT',
        type: 'CODE_SET',
        status: 'CODE_SET',
        isRequired: 'BOOLEAN',
        decision: 'CODE_SET',
        validFrom: 'DATE',
        validTo: 'DATE',
        source: 'TEXT',
        regulatoryBasis: 'CODE_SET'
    },
    preferences: {
        name: 'TEXT',
        type: 'TEXT',
        channels: {
            type: 'CODE_SET',
            isOptedIn: 'BOOLEAN',
            lastOptedInDate: 'DATE',
            frequency: 'TEXT',
            preferredStartTime: 'TIME',
            preferredEndTime: 'TIME'
        }
    }
};

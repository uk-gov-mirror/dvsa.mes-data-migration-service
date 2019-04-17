import { IConnectionPool } from 'oracledb';
import { query, update } from './database';

export const changeSpecialNeedsText = async (
  connPool: IConnectionPool,
  applicationId: number,
  specialNeedsText: string,
) => {
  return update(
    connPool,
    `
    UPDATE TARSUAT.APPLICATION
    SET SPECIAL_NEEDS_TEXT = :specialNeedsText
    WHERE APP_ID = :applicationId
    `,
    1,
    {
      specialNeedsText,
      applicationId,
    },
  );
};

export const changePersonalCommitmentActivityCode = async (
  connPool: IConnectionPool,
  commitmentId: number,
  activityCode: string,
) => {
  return update(
    connPool,
    `
    UPDATE
      TARSUAT.PERSONAL_COMMITMENT
    SET
      NON_TEST_ACTIVITY_CODE = :activityCode
    WHERE
      COMMITMENT_ID = :commitmentId
    `,
    1,
    {
      activityCode,
      commitmentId,
    },
  );
};

export const changeSlotNonTestActivityCode = async (
  connPool: IConnectionPool,
  slotId: number,
  nonTestActivityCode: number,
) => {
  return update(
    connPool,
    `
    UPDATE TARSUAT.PROGRAMME_SLOT
    SET NON_TEST_ACTIVITY_CODE = :nonTestActivityCode
    WHERE SLOT_ID = :slotId
    `,
    1,
    {
      nonTestActivityCode,
      slotId,
    },
  );
};

export const changeTelephoneNumber = async (
  connPool: IConnectionPool,
  individualId: number,
  telephoneNumber: string,
) => {
  return update(
    connPool,
    `
    UPDATE TARSUAT.CONTACT_DETAILS
    SET MOBILE_TEL_NUMBER = :telephoneNumber
    WHERE INDIVIDUAL_ID = :individualId
    `,
    1,
    {
      telephoneNumber,
      individualId,
    },
  );
};

export const getActiveExaminers = async (connPool: IConnectionPool, activeDate: Date): Promise<Object[]> => {
  return query(
    connPool,
    `
    SELECT
      E.INDIVIDUAL_ID,
      E.STAFF_NUMBER,
      ACTIVE_POSTING.TC_ID,
      E.GRADE_CODE
    FROM
      TARSUAT.EXAMINER E,
      TARSUAT.INDIVIDUAL I,
      (
        SELECT P.INDIVIDUAL_ID AS POSTING_INDV_ID, P.TC_ID AS TC_ID
        FROM TARSUAT.POSTING P
        WHERE :activeDate BETWEEN TRUNC(P.START_DATE) AND TRUNC(P.END_DATE)
      ) ACTIVE_POSTING
    WHERE
      E.INDIVIDUAL_ID = I.INDIVIDUAL_ID
      AND E.INDIVIDUAL_ID = ACTIVE_POSTING.POSTING_INDV_ID(+)
      AND NVL(E.GRADE_CODE, 'ZZZ') != 'DELE'
      AND EXISTS
        (
          SELECT END_DATE
          FROM TARSUAT.EXAMINER_STATUS ES
          WHERE ES.INDIVIDUAL_ID = E.INDIVIDUAL_ID
          AND NVL(ES.END_DATE, TO_DATE('01/01/4000', 'DD/MM/YYYY')) > :activeDate
        )
    `,
    {
      activeDate,
    },
  );
};

export const getBookings = (
  connPool: IConnectionPool,
  activeDate: Date,
  individualIds: number[],
): Promise<Object[]> => {
  return query(
    connPool,
    `
    SELECT
      PS.SLOT_ID,
      A.APP_ID,
      I.INDIVIDUAL_ID,
      I.DRIVER_NUMBER,
      I.FIRST_FORENAME,
      I.FAMILY_NAME
    FROM
      TARSUAT.PROGRAMME P,
      TARSUAT.PROGRAMME_SLOT PS,
      TARSUAT.BOOKING B,
      TARSUAT.APPLICATION A,
      TARSUAT.INDIVIDUAL I
    WHERE
      TRUNC(P.PROGRAMME_DATE) = TRUNC(:0)
      AND P.INDIVIDUAL_ID IN (${generateInClause(1, individualIds)})
      AND
        (
          P.STATE_CODE NOT IN (2, 3)
          OR EXISTS
            (
              SELECT
                BOOK.BOOKING_ID
              FROM
                TARSUAT.BOOKING BOOK,
                TARSUAT.PROGRAMME_SLOT SLOT
              WHERE
                SLOT.SLOT_ID = BOOK.SLOT_ID
                AND TRUNC(SLOT.PROGRAMME_DATE) = TRUNC(P.PROGRAMME_DATE)
                AND SLOT.INDIVIDUAL_ID = P.INDIVIDUAL_ID
                AND SLOT.TC_ID = P.TC_ID
                AND BOOK.STATE_CODE = 1
            )
        )
      AND TRUNC(PS.PROGRAMME_DATE) = TRUNC(P.PROGRAMME_DATE)
      AND PS.INDIVIDUAL_ID = P.INDIVIDUAL_ID
      AND PS.TC_ID = P.TC_ID
      AND PS.TC_CLOSED_IND != 1
      AND NVL(PS.DEPLOYED_TO_FROM_CODE, 0) != 1
      AND B.SLOT_ID = PS.SLOT_ID
      AND B.STATE_CODE != 2
      AND A.APP_ID = B.APP_ID
      AND I.INDIVIDUAL_ID = A.INDIVIDUAL_ID
    `,
    ([activeDate] as any[]).concat(individualIds),
  );
};

export const getPersonalCommitments = (
  connPool: IConnectionPool,
  activeDate: Date,
): Promise<Object[]> => {
  return query(
    connPool,
    `
    SELECT
      PC.COMMITMENT_ID
    FROM
      TARSUAT.PERSONAL_COMMITMENT PC
    WHERE
      :activeDate BETWEEN PC.START_DATE_TIME AND PC.END_DATE_TIME
    `,
    {
      activeDate,
    },
  );
};

/**
 * Generates a SQL "IN" clause with numbered parameter bindings for the specified array,
 * starting from the initial binding index.
 *
 * @example
 * // returns ':0,:1,:2'
 * generateInClause(0, [51, 52, 53]);
 *
 * @example
 * // returns ':1,:2,:3'
 * generateInClause(1, [51, 52, 53]);
 *
 * @param initialBinding The index of the initial binding.
 * @param objects The array of parameters.
 * @returns The comma-delimited list of parameter bindings.
 */
const generateInClause = (initialBinding: number, objects: Object[]): string => {
  const length = (objects == null) ? 0 : objects.length;
  let clause = '';
  for (let i = 0; i < length; i += 1) {
    // tslint:disable-next-line:prefer-template
    clause += ((i > 0) ? ', ' : '') + ':' + (i + initialBinding);
  }
  return clause;
};

export const getExaminerSubset = (results: Object[], count: number): number[] => {
  let subset = [];

  if (results != null) {
    results.slice(0, Math.min(count, results.length)).forEach((result) => {
      if ('INDIVIDUAL_ID' in result) {
        subset = subset.concat(result['INDIVIDUAL_ID']);
      }
    });
  }
  return subset;
};

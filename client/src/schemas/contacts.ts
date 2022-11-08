import * as yup from "yup";
import * as _ from "lodash";
import { IndividualGender } from "@/store/contacts";

export const individualSchema = yup.object({
  id: yup.number().nullable(),
  firstName: yup
    .string()
    .nullable()
    .label("First Name")
    .transform((value: string | null) => value && value.trim()),
  middleName: yup
    .string()
    .nullable()
    .label("Middle Name")
    .transform((value: string | null) => value && value.trim()),
  lastName: yup
    .string()
    .nullable()
    .label("Last Name")
    .transform((value: string | null) => value && value.trim()),
  alias: yup.string().nullable().label("Alias"),
  note: yup.string().nullable().label("Notes"),
  gender: yup
    .string()
    .nullable()
    .oneOf([null, ..._.values(IndividualGender)])
    .label("Gender"),
  dateOfBirth: yup
    .date()
    .nullable()
    .label("Date of birth")
    .transform((value, _originalValue, schema) => {
      if (schema.isType(value)) return value;

      return null;
    }),
  dateOfDeath: yup
    .date()
    .nullable()
    .label("Date of death")
    .transform((value, _originalValue, schema) => {
      if (schema.isType(value)) return value;

      return null;
    }),
  hasDied: yup.boolean().label("Has died").nullable(),
});

export const parentTypeSchema = yup
  .object({
    id: yup.number(),
    type: yup.string().required().label("Parent Type").defined(),
  })
  .defined();

export const coupleSchema = yup.object({
  id: yup.number(),
  partner1: individualSchema.label("Partner 1"),
  partner2: individualSchema.label("Partner 2"),
  stillMarried: yup.boolean().label("Still married").default(true),
});

export const parentalLinkSchema = yup
  .object({
    id: yup.number(),
    type: parentTypeSchema,
    parentCouple: coupleSchema,
    child: individualSchema,
  })
  .defined();

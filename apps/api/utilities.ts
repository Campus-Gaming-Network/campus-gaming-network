import { Request } from "express";
import { customAlphabet } from "nanoid";
import * as bcrypt from "bcrypt";
import { NANO_ALPHABET, NANO_ID_LENGTH, SALT_ROUNDS } from "./constants";

interface ParsedRequestQuery {
  offset?: number;
  limit?: number;
  attributes?: string[];
  order?: [string] | [string, string];
}

export const parseRequestQuery = (req: Request): ParsedRequestQuery => {
  let parsed = {};

  if (req.query.offset) {
    const offset = Number(req.query.offset) || undefined;

    if (offset) {
      parsed = { ...parsed, offset };
    }
  }

  if (req.query.limit) {
    const limit = Number(req.query.limit) || undefined;

    if (limit) {
      parsed = { ...parsed, limit };
    }
  }

  let attributes: string[] = [];

  if (req.query.attributes) {
    if (typeof req.query.attributes === "string") {
      req.query.attributes.split(",").forEach((field) => {
        attributes.push(field);
      });
    } else if (Array.isArray(req.query.attributes)) {
      attributes = req.query.attributes.map((field) => String(field));
    }
  }

  if (attributes.length) {
    parsed = { ...parsed, attributes };
  }

  if (req.query.orderBy) {
    let order = [req.query.orderBy];

    if (req.query.orderDirection) {
      order.push(req.query.orderDirection);
    }

    parsed = {
      ...parsed,
      order: [order],
    };
  }

  return parsed;
};

// Returns a callable function
export const nanoid = customAlphabet(NANO_ALPHABET, NANO_ID_LENGTH);

export const hashPassword = async (password: string): Promise<string> =>
  await bcrypt.hash(password, SALT_ROUNDS);

export const comparePasswords = async (
  password: string,
  hash: string
): Promise<boolean> => await bcrypt.compare(password, hash);

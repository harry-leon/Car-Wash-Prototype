import test from "node:test";
import assert from "node:assert/strict";
import {
  getAvailableStaff,
  getStaffAvailability,
  requireAvailableStaff,
} from "./staff-availability.ts";

const staff = [
  { id: "s1", name: "Tran Bao Nam", status: "Active" },
  { id: "s2", name: "Hoang Lan", status: "Inactive" },
  { id: "s3", name: "Nguyen Van Hung", status: "Active" },
];

test("marks active staff with an active wash session as Busy", () => {
  const result = getStaffAvailability(staff, [
    { id: "ws1", staffId: "s1", status: "Queued" },
    { id: "ws2", staffId: "s3", status: "Completed" },
  ]);

  assert.deepEqual(
    result.map((item) => ({ id: item.id, availability: item.availability })),
    [
      { id: "s1", availability: "Busy" },
      { id: "s3", availability: "Available" },
    ],
  );
});

test("returns only employees who can be assigned to a new vehicle", () => {
  const result = getAvailableStaff(staff, [
    { id: "ws1", staffId: "s1", status: "Ready for Checkout" },
  ]);

  assert.deepEqual(
    result.map((item) => item.id),
    ["s3"],
  );
});

test("blocks check-in when every active employee is busy", () => {
  assert.throws(
    () =>
      requireAvailableStaff(staff, [
        { id: "ws1", staffId: "s1", status: "Queued" },
        { id: "ws2", staffId: "s3", status: "Ready for Checkout" },
      ]),
    /No available staff/,
  );
});

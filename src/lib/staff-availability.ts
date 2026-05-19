export type StaffAvailabilityStatus = "Available" | "Busy";

export interface AvailabilityStaff {
  id: string;
  name: string;
  status: string;
}

export interface AvailabilitySession {
  id: string;
  staffId: string;
  status: string;
}

export interface StaffAvailability extends AvailabilityStaff {
  availability: StaffAvailabilityStatus;
  activeSessionId?: string;
}

const COMPLETED_SESSION_STATUS = "Completed";
export const NO_AVAILABLE_STAFF_MESSAGE =
  "No available staff. Please wait until a staff member becomes available.";

export function getStaffAvailability(
  staffMembers: AvailabilityStaff[],
  washSessions: AvailabilitySession[],
): StaffAvailability[] {
  return staffMembers
    .filter((staff) => staff.status === "Active")
    .map((staff) => {
      const activeSession = washSessions.find(
        (session) => session.staffId === staff.id && session.status !== COMPLETED_SESSION_STATUS,
      );

      return {
        ...staff,
        availability: activeSession ? "Busy" : "Available",
        activeSessionId: activeSession?.id,
      };
    });
}

export function getAvailableStaff(
  staffMembers: AvailabilityStaff[],
  washSessions: AvailabilitySession[],
): StaffAvailability[] {
  return getStaffAvailability(staffMembers, washSessions).filter(
    (staff) => staff.availability === "Available",
  );
}

export function requireAvailableStaff(
  staffMembers: AvailabilityStaff[],
  washSessions: AvailabilitySession[],
): StaffAvailability {
  const staff = getAvailableStaff(staffMembers, washSessions)[0];
  if (!staff) {
    throw new Error(NO_AVAILABLE_STAFF_MESSAGE);
  }
  return staff;
}

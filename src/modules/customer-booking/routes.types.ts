export const customerBookingRoutes = {
  home: '/app/home',
  vehicles: '/app/vehicles',
  vehiclesNew: '/app/vehicles/new',
  vehiclesEdit: '/app/vehicles/:id/edit',
  booking: '/app/booking',
  history: '/app/history',
  historyBookings: '/app/history/bookings',
  historyWashes: '/app/history/washes',
  historyPoints: '/app/history/points',
} as const;

export type CustomerRouteKey = keyof typeof customerBookingRoutes;

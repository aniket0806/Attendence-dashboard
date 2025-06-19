// // features/dashboard/dashboardSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { apiClient } from '../../lib/api-client';
// import { DASHBOARD_ROUTE } from '../../utils/constants';


// export const fetchDashboard = createAsyncThunk('dashboard/fetch', async () => {
//   const response = await apiClient.get(DASHBOARD_ROUTE);
//   return response.data;
// });

// const dashboardSlice = createSlice({
//   name: 'dashboard',
//   initialState: {
//     data: null,
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchDashboard.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchDashboard.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data = action.payload;
//       })
//       .addCase(fetchDashboard.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   },
// });

// export default dashboardSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../lib/api-client';
import { DASHBOARD_ROUTE } from '../../utils/constants';

export const fetchDashboard = createAsyncThunk('dashboard/fetch', async () => {
  const response = await apiClient.get(DASHBOARD_ROUTE);
  return response.data;
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    // New reducer for real-time updates
    updateAttendanceCounts: (state, action) => {
      if (!state.data) return;

      const { department, activity } = action.payload;
      
      // Clone the data to avoid mutating the original state directly
      const updatedData = JSON.parse(JSON.stringify(state.data));

      // Handle department summary updates
      if (updatedData.deptSummary) {
        let deptIndex = updatedData.deptSummary.findIndex(
          d => d.department_code === department
        );

        if (deptIndex === -1) {
          // Create new department entry if not found
          updatedData.deptSummary.push({
            department_code: department,
            total_employees: 0,
            present_count: 0,
            out_count: 0,
            attendance_percentage: "0.00"
          });
          deptIndex = updatedData.deptSummary.length - 1;
        }

        const dept = updatedData.deptSummary[deptIndex];
        
        switch (activity?.toLowerCase()) {
          case 'check_in':
            dept.present_count += 1;
            dept.total_employees += 1;
            break;
          case 'check_out':
            dept.out_count += 1;
            break;
          // Add other cases if needed (break_in, break_out, etc.)
        }

        // Recalculate percentage
        dept.attendance_percentage = (
          (dept.present_count / Math.max(dept.total_employees, 1)) * 100
        ).toFixed(2);
      }

      // Handle employee attendance updates
      if (updatedData.employeeAttendance) {
        // Add logic to update specific employee records if needed
        // This would depend on your data structure
      }

      state.data = updatedData;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the new action creator
export const { updateAttendanceCounts } = dashboardSlice.actions;

export default dashboardSlice.reducer;
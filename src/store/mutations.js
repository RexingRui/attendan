import {
  INITIAL_USER_NUM,
  CHANGE_USER_NUM,
  INITIAL_STAFF_NUM,
  CHANGE_STAFF_NUM,
  INITIAL_STAFF_DATA,
  CHANGE_STAFF_DATA,
  CHANGE_CURRENT_PAGE,
  DO_ATTENDANCE,
  UPDATE_LOGIN_USER
} from "@/common/mutation-types.js";

export default {
  [INITIAL_USER_NUM](state, payload) {
    state.user.userNum = payload.userNum;
    state.user.userData = payload.userData;
  },

  [CHANGE_USER_NUM](state, payload) {
    state.user.userNum = payload.userNum + 1;
    state.user.userData = payload.userData;

  },

  [INITIAL_STAFF_NUM](state, staffNum) {
    state.staffNum = staffNum;
  },

  [CHANGE_STAFF_NUM](state, staffNum) {
    state.staffNum = staffNum;
  },

  [INITIAL_STAFF_DATA](state, staffDatas) {
    state.staffDatas = staffDatas;
  },

  [CHANGE_STAFF_DATA](state, payload) {
    if (payload.flag == "change") {
      // 替换员工信息 1.基本资料更改 2.考勤信息更改
      state.staffDatas.forEach((value, index) => {
        if (value.id == payload.staffData.id) {
          state.staffDatas.splice(index, 1, payload.staffData)
        }
      });
    } else if (payload.flag == "add") {
      state.staffDatas.push(payload.staffData);
    } else if (payload.flag == "remove") {
      if (payload.deleteIndex) {
        state.staffDatas = state.staffDatas.filter(staff => {
          return !payload.deleteIndex.some(x => {
            return x == staff.id;
          })
        })
      }
    }
  },

  [CHANGE_CURRENT_PAGE](state, pageIndex) {
    state.pageIndex = pageIndex;
  },

  [DO_ATTENDANCE](state, staffAttendance) {
    state.currentStaffAttend = staffAttendance;
  },

  [UPDATE_LOGIN_USER](state, payload) {
    state.loginUser = payload.loginUser;
  }
};
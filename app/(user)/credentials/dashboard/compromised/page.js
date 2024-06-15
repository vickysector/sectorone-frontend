"use client";

import { dataOverview } from "@/app/_lib/TempDataOverview";
import ChangeUrlButton from "@/app/_ui/components/buttons/ChangeUrlButton";
import CompromiseButton from "@/app/_ui/components/buttons/CompromiseButton";
import OutlineButton from "@/app/_ui/components/buttons/OutlineButton";
import OverviewCard from "@/app/_ui/dashboard/OverviewCard";
import "@/app/_ui/CheckboxCustom2.css";
import clsx from "clsx";
import Image from "next/image";
import { useRouter, redirect } from "next/navigation";
import ExportButton from "@/app/_ui/components/buttons/ExportButton";
import {
  EyeOutlined,
  BookOutlined,
  CheckCircleFilled,
  BookFilled,
  RightOutlined,
} from "@ant-design/icons";
import {
  Pagination,
  ConfigProvider,
  DatePicker,
  Spin,
  Select,
  Checkbox,
  Popover,
} from "antd";
import { useEffect, useState } from "react";
import {
  setBreachesEmployee,
  setBreachesEmployeeAndUsers,
  setBreachesUsers,
  setIcon,
  setLastUpdateUsers,
  setUrl,
} from "@/app/_lib/store/features/Breaches/BreachesSlices";
import { useSelector, useDispatch } from "react-redux";
import { setCookie, getCookie, hasCookie, deleteCookie } from "cookies-next";
import { setChangeUrl } from "@/app/_lib/store/features/Home/ChangeUrlSlice";
import {
  DETAIL_COMPROMISED_BOOKMARK,
  DETAIL_COMPROMISED_COMPROMISE_DEVICES,
  DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE,
  DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY,
  DETAIL_COMPROMISED_COMPROMISE_USERS,
  DETAIL_COMPROMISED_DEFAULT,
  DETAIL_COMPROMISED_TESTING,
} from "@/app/_lib/variables/Variables";
import { APIDATAV1 } from "@/app/_lib/helpers/APIKEYS";
import { DeleteCookies } from "@/app/_lib/helpers/DeleteCookies";
import { RedirectToLogin } from "@/app/_lib/helpers/RedirectToLogin";
import {
  CalculatePasswordStrengthWithReturnPlainString,
  CalculatePasswordStrengthWithReturnString,
  convertDateFormat,
} from "@/app/_lib/CalculatePassword";
import { setLoadingState } from "@/app/_lib/store/features/Compromised/LoadingSlices";
import {
  setDataDetails,
  setDetailState,
  setFilters,
  setSection,
} from "@/app/_lib/store/features/Compromised/DetailSlices";
import {
  setBookmarkConfirmState,
  setBookmarkDomainData,
  setBookmarkIdData,
} from "@/app/_lib/store/features/Compromised/BookmarkSlices";
import {
  setUnBookmarkConfirmState,
  setUnBookmarkDomainData,
  setUnBookmarkIdData,
} from "@/app/_lib/store/features/Compromised/UnBookmarkSlices";
import { setUrlData } from "@/app/_lib/store/features/Home/ChooseUrlSlice";
import {
  addIdtoIds,
  clearIds,
  removeIdtoIds,
  setMarkedAsBookmark,
  setMarkedAsValidated,
  setStatusMultipleBookmark,
} from "@/app/_lib/store/features/Compromised/CheckboxSlices";
import {
  setCallExportCSVFunctions,
  setConfirmExportToCsvCompromise,
  setSectionExportToCSVCompromise,
  setSubSectionExportToCSVCompromise,
} from "@/app/_lib/store/features/Export/ExportToCsvCompromiseSlice";
// import ReactApexChart from "react-apexcharts";
// import ApexCharts from "apexcharts";
import dynamic from "next/dynamic";
import { fetchWithRefreshToken } from "@/app/_lib/token/fetchWithRefreshToken";
import { Tooltip } from "@/app/_ui/components/utils/Tooltips";
import dayjs from "dayjs";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

// const DynamicApexCharts = dynamic(() => import("react-apexcharts"), {
//   ssr: false, // Ensure ApexCharts is not imported during SSR
// });

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const { RangePicker } = DatePicker;

export default function CompromisedDashboard() {
  const [showDate, setShowDate] = useState(false);
  const [selectedButton, setSelectedButton] = useState(
    DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE
  );
  const [selectedOutlineButton, setSelectedOutlineButton] = useState(
    DETAIL_COMPROMISED_DEFAULT
  );

  const [filterApplied, setFilterApplied] = useState(false); // state for make sure data after search and rangedate is running once

  const [dataSource, setDataSource] = useState();

  const [inputSearch, setInputSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalEmployee, setTotalEmployee] = useState();
  const [totalUsers, setTotalUsers] = useState();
  const [totalThirdParty, setTotalThirdParty] = useState();
  const [totalDevice, setTotalDevice] = useState();
  const [totalRows, setTotalRows] = useState("");

  const [employeeData, setEmployeeData] = useState(null);
  const [usersData, setUsersData] = useState(null);
  const [thirdPartyData, setThirdPartyData] = useState(null);
  const [devicesData, setDevicesData] = useState(null);
  const [selectValidasi, setSelectValidasi] = useState();
  const [validasiSuccess, setValidasiSuccess] = useState(null);

  const [employeeBookmarkData, setEmployeeBookmarkData] = useState(null);
  const [usersBookmarkData, setUsersBookmarkData] = useState(null);
  const [thirdPartyBookmarkData, setThirdPartyBookmarkData] = useState(null);
  const [devicesBookmarkData, setDevicesBookmarkData] = useState(null);

  const [employeeValidatedData, setEmployeeValidatedData] = useState(null);
  const [usersValidatedData, setUsersValidatedData] = useState(null);
  const [thirdPartyValidatedData, setThirdPartyValidatedData] = useState(null);

  const [breachesAll, setBreachesAll] = useState();
  const [employeeBreaches, setEmployeeBreaches] = useState();
  const [usersBreaches, setUserBreaches] = useState();
  const [urlBreaches, setUrlBreaches] = useState();
  const [iconBreaches, setIconBreaches] = useState();
  const [lastUpdate, setLastUpdate] = useState();
  const [domainUsers, setDomainUsers] = useState();

  // Start of: Timer
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [intervalRef, setIntervalRef] = useState(null);

  // End of: Timer

  // Start of: Handle Page
  const [page, setPage] = useState(1);
  const [pageEmployeeValidate, setPageEmployeeValidate] = useState(1);
  const [pageEmployeeBookmark, setPageEmployeeBookmark] = useState(1);
  const [pageUsers, setPageUsers] = useState(1);
  const [pageUsersValidate, setPageUsersValidate] = useState(1);
  const [pageUsersBookmark, setPageUserBookmark] = useState(1);
  const [pageThirdParty, setPageThirdParty] = useState(1);
  const [pageThirdPartyValidate, setPageThirdPartyValidate] = useState(1);
  const [pageThirdPartyBookmark, setPageThirdPartyBookmark] = useState(1);
  const [pageDevices, setPageDevices] = useState(1);
  const [pageDevicesBookmark, setPageDevicesBookmark] = useState(1);

  const handlePage = (page) => {
    setPage(page);
  };

  const handlepageEmployeeValidate = (page) => {
    setPageEmployeeValidate(page);
  };

  const handlepageEmployeeBookmark = (page) => {
    setPageEmployeeBookmark(page);
  };

  const handlepageusers = (page) => {
    setPageUsers(page);
  };

  const handlesetPageUsersValidate = (page) => {
    setPageUsersValidate(page);
  };

  const handlesetPageUserBookmark = (page) => {
    setPageUserBookmark(page);
  };

  const handlesetPageThirdParty = (page) => {
    setPageThirdParty(page);
  };

  const handlesetPageThirdPartyValidate = (page) => {
    setPageThirdPartyValidate(page);
  };

  const handlesetPageThirdPartyBookmark = (page) => {
    setPageThirdPartyBookmark(page);
  };

  const handlesetPageDevices = (page) => {
    setPageDevices(page);
  };

  const handlesetPageDevicesBookmark = (page) => {
    setPageDevicesBookmark(page);
  };

  // End of: Handle Page

  // console.log("select validasi: ", selectValidasi);

  // Start of: Tooptips in notifications

  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const [isHoveredRangeDate, setIsHoveredRangeDate] = useState(false);
  const handleMouseEnterRangeDate = () => {
    setIsHoveredRangeDate(true);
  };

  const handleMouseLeaveRangeDate = () => {
    setIsHoveredRangeDate(false);
  };
  // End of: Tooltips in notifications

  // Start of: Spline area Chart

  const options = {
    chart: {
      type: "area",
      height: 350,
      width: "100%",
      zoom: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    colors: ["#FF6F1E", "#2F54EB"],
    xaxis: {
      categories: ["2023", "2024"], // Add year labels
    },
    // Add more options as needed
  };

  const series = [
    {
      name: "Customer Breach",
      data: [0, usersBreaches && usersBreaches],
    },
    {
      name: "Employee Breach",
      data: [0, employeeBreaches && employeeBreaches],
    },
  ];

  // End of: Spline area Chart

  // Start of: Handle export to CSV

  const callExportToCSVEmployeeDefault = () => {
    // fetchExportToCsvEmployeeDefault(inputSearch);
    fetchExportToCSVEmployeeDefaultWithRefreshToken(inputSearch);
  };

  const callExportToCSVEmployeeTested = () => {
    // fetchExportToCsvEmployeeTested(inputSearch);
    fetchExportToCSVEmployeeTestedWithRefreshToken(inputSearch);
  };

  const callExportToCSVEmployeeBookmark = () => {
    // fetchExportToCsvEmployeeBookmark(inputSearch);
    fetchExportToCSVEmployeeBookmarkWithRefreshToken(inputSearch);
  };

  const callExportToCSVUsersDefault = () => {
    // fetchExportToCsvUserDefault(inputSearch);
    fetchExportToCSVUserDefaultWithRefreshToken(inputSearch);
  };

  const callExportToCSVUsersTested = () => {
    // fetchExportToCsvUserTested(inputSearch);
    fetchExportToCSVUserTestedWithRefreshToken(inputSearch);
  };

  const callExportTocSVUserBookmark = () => {
    // fetchExportToCsvUserBookmark(inputSearch);
    fetchExportToCSVUserBookmarkWithRefreshToken(inputSearch);
  };

  const callExportToCsvThirdpartyDefault = () => {
    // fetchExportToCsvThirdPartyDefault(inputSearch);
    fetchExportToCSVThirdPartyDefaultWithRefreshToken(inputSearch);
  };

  const callExportToCsvThirdpartyTested = () => {
    // fetchExportToCsvThirdPartyTested(inputSearch);
    fetchExportToCSVThirdPartyTestedWithRefreshToken(inputSearch);
  };

  const callExportToCsvThirdpartyBookmark = () => {
    // fetchExportToCsvThirdPartyBookmark(inputSearch);
    fetchExportToCSVThirdPartyBookmarkWithRefreshToken(inputSearch);
  };

  const callExportToCsvDeviceDefault = () => {
    // fetchExportToCsvDevicesDefault(inputSearch);
    fetchExportToCSVDevicesDefaultWithRefreshToken(inputSearch);
  };

  const callExportToCsvDeviceBookmark = () => {
    // fetchExportToCsvDevicesBookmark(inputSearch);
    fetchExportToCSVDevicesBookmarkWithRefreshToken(inputSearch);
  };

  const handleExportToCSV = () => {
    dispatch(setConfirmExportToCsvCompromise(true));

    switch (selectedButton) {
      case DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE:
        if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
          dispatch(setCallExportCSVFunctions(callExportToCSVEmployeeBookmark));
          dispatch(setSectionExportToCSVCompromise("Employee"));
          dispatch(setSubSectionExportToCSVCompromise("Bookmarked"));
        } else if (selectedOutlineButton === DETAIL_COMPROMISED_TESTING) {
          // callExportToCSVEmployeeTested();
          dispatch(setCallExportCSVFunctions(callExportToCSVEmployeeTested));
          dispatch(setSectionExportToCSVCompromise("Employee"));
          dispatch(setSubSectionExportToCSVCompromise("Validated"));
        } else {
          dispatch(setCallExportCSVFunctions(callExportToCSVEmployeeDefault));
          dispatch(setSectionExportToCSVCompromise("Employee"));
          dispatch(setSubSectionExportToCSVCompromise("Compromised"));
        }
        break;
      case DETAIL_COMPROMISED_COMPROMISE_DEVICES:
        if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
          dispatch(setCallExportCSVFunctions(callExportToCsvDeviceBookmark));
          dispatch(setSectionExportToCSVCompromise("Devices"));
          dispatch(setSubSectionExportToCSVCompromise("Bookmarked"));
        } else {
          dispatch(setCallExportCSVFunctions(callExportToCsvDeviceDefault));
          dispatch(setSectionExportToCSVCompromise("Devices"));
          dispatch(setSubSectionExportToCSVCompromise("Compromised"));
        }
        break;
      // // Add more cases for other buttons if needed
      case DETAIL_COMPROMISED_COMPROMISE_USERS:
        if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
          dispatch(setCallExportCSVFunctions(callExportTocSVUserBookmark));
          dispatch(setSectionExportToCSVCompromise("Users"));
          dispatch(setSubSectionExportToCSVCompromise("Bookmarked"));
        } else if (selectedOutlineButton === DETAIL_COMPROMISED_TESTING) {
          dispatch(setCallExportCSVFunctions(callExportToCSVUsersTested));
          dispatch(setSectionExportToCSVCompromise("Users"));
          dispatch(setSubSectionExportToCSVCompromise("Validated"));
        } else {
          dispatch(setCallExportCSVFunctions(callExportToCSVUsersDefault));
          dispatch(setSectionExportToCSVCompromise("Users"));
          dispatch(setSubSectionExportToCSVCompromise("Compromised"));
        }
        break;
      case DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY:
        if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
          dispatch(
            setCallExportCSVFunctions(callExportToCsvThirdpartyBookmark)
          );
          dispatch(setSectionExportToCSVCompromise("Third-Party"));
          dispatch(setSubSectionExportToCSVCompromise("Bookmarked"));
        } else if (selectedOutlineButton === DETAIL_COMPROMISED_TESTING) {
          dispatch(setCallExportCSVFunctions(callExportToCsvThirdpartyTested));
          dispatch(setSectionExportToCSVCompromise("Third-Party"));
          dispatch(setSubSectionExportToCSVCompromise("Validated"));
        } else {
          dispatch(setCallExportCSVFunctions(callExportToCsvThirdpartyDefault));
          dispatch(setSectionExportToCSVCompromise("Third-Party"));
          dispatch(setSubSectionExportToCSVCompromise("Compromised"));
        }
        break;
      default:
        break;
    }
  };

  // End of: Handle export to CSV

  // Start of: Handle detect export button when empty

  const handleDisableExportButton = () => {
    switch (selectedButton) {
      case DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE:
        if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
          return employeeBookmarkData && employeeBookmarkData.count === null;
        } else if (selectedOutlineButton === DETAIL_COMPROMISED_TESTING) {
          return employeeValidatedData && employeeValidatedData.count === null;
        } else {
          return employeeData && employeeData.count === null;
        }
      case DETAIL_COMPROMISED_COMPROMISE_DEVICES:
        if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
          return devicesBookmarkData && devicesBookmarkData.count === null;
        } else {
          return devicesData && devicesData.count === null;
        }
      // // Add more cases for other buttons if needed
      case DETAIL_COMPROMISED_COMPROMISE_USERS:
        if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
          return usersBookmarkData && usersBookmarkData.count === null;
        } else if (selectedOutlineButton === DETAIL_COMPROMISED_TESTING) {
          return usersValidatedData && usersValidatedData.count === null;
        } else {
          return usersData && usersData.count === null;
        }
      case DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY:
        if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
          return (
            thirdPartyBookmarkData && thirdPartyBookmarkData.count === null
          );
        } else if (selectedOutlineButton === DETAIL_COMPROMISED_TESTING) {
          return (
            thirdPartyValidatedData && thirdPartyValidatedData.count === null
          );
        } else {
          return thirdPartyData && thirdPartyData.count === null;
        }
      default:
        break;
    }
  };

  // End of: Handle detect export button when empty

  // Start of: check if section is bookmark

  const checkIsBookmarkSection = () => {
    switch (selectedButton) {
      case DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE:
        if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
          return "bookmark";
        } else {
          return "no-bookmark";
        }
      case DETAIL_COMPROMISED_COMPROMISE_DEVICES:
        if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
          return "bookmark";
        } else {
          return "no-bookmark";
        }
      // // Add more cases for other buttons if needed
      case DETAIL_COMPROMISED_COMPROMISE_USERS:
        if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
          return "bookmark";
        } else {
          return "no-bookmark";
        }
      case DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY:
        if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
          return "bookmark";
        } else {
          return "no-bookmark";
        }
      default:
        break;
    }
  };

  // End of : Check if section is Bookmark

  const handleCheckBookmarkOrUnbookmarkText = () => {
    switch (selectedButton) {
      case DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE:
        if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
          return "Unbookmark Item";
        } else {
          return "Bookmark Item";
        }
      case DETAIL_COMPROMISED_COMPROMISE_DEVICES:
        if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
          return "Unbookmark Item";
        } else {
          return "Bookmark Item";
        }
      // // Add more cases for other buttons if needed
      case DETAIL_COMPROMISED_COMPROMISE_USERS:
        if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
          return "Unbookmark Item";
        } else {
          return "Bookmark Item";
        }
      case DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY:
        if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
          return "Unbookmark Item";
        } else {
          return "Bookmark Item";
        }
      default:
        break;
    }
  };

  // Start of:  Checkbox Bookmark Functionality

  const [initialCheckboxState, setInitialCheckboxState] = useState(false);

  const checkboxArray = useSelector((state) => state.checkbox.ids);
  const statusStateMultipleBookmark = useSelector(
    (state) => state.checkbox.success
  );
  const bannerStateMultipleBookmark = useSelector(
    (state) => state.checkbox.banner
  );

  const handleInitialCheckboxState = (e) => {
    setInitialCheckboxState(e.target.checked);
    if (!e.target.value) {
      dispatch(clearIds());
    }
  };

  const handleGatheringIds = (e, id, status) => {
    dispatch(setStatusMultipleBookmark(status));

    if (e.target.checked) {
      dispatch(addIdtoIds(id));
    } else {
      dispatch(removeIdtoIds(id));
    }
  };

  const handleBookmarkAllCheckboxes = () => {
    dispatch(setMarkedAsBookmark(true));
  };

  // End of: Checkbox Bookmark Functionality

  // Start of:  Checkbox Validated Functionality

  const handleValidatedAllCheckbox = () => {
    dispatch(setMarkedAsValidated(true));
  };

  const statusStateMultipleValidated = useSelector(
    (state) => state.checkbox.success_validated
  );
  const bannerStateMultipleValidated = useSelector(
    (state) => state.checkbox.banner_validated
  );

  // End of:  Checkbox Validated Functionality

  // console.log("bookmark status data: ", statusStateMultipleBookmark);
  // console.log("validate status data: ", statusStateMultipleValidated);

  const loadingCompromisedData = useSelector(
    (state) => state.compromised.status
  );

  const dispatch = useDispatch();
  const router = useRouter();

  // const domainUsers = useSelector((state) => state.chooseUrl.urlData);

  // const breachesAll = useSelector((state) => state.breaches.breachesAll);

  // const employeeBreaches = useSelector(
  //   (state) => state.breaches.breachesEmployee
  // );

  const bookmarkSuccessState = useSelector(
    (state) => state.bookmarkCompromise.success
  );
  const unbookmarkSuccessState = useSelector(
    (state) => state.unbookmarkCompromise.success
  );

  const bookmarBannerState = useSelector(
    (state) => state.bookmarkCompromise.banner
  );
  const unbookmarBannerState = useSelector(
    (state) => state.unbookmarkCompromise.banner
  );

  // const usersBreaches = useSelector((state) => state.breaches.breachesUsers);

  // const urlBreaches = useSelector((state) => state.breaches.url);

  // const iconBreaches = useSelector((state) => state.breaches.icon);

  // const lastUpdate = useSelector((state) => state.breaches.lastUpdate);
  const getBreachesData = async () => {
    try {
      const res = await fetch(
        `${APIDATAV1}breaches?year=2024&type=overview&status=all`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      setBreachesAll(data.data.all_breaches);
      setEmployeeBreaches(data.data.employee_breaches);
      setUserBreaches(data.data.user_breaches);
      setUrlBreaches(data.data.name_domain);
      setIconBreaches(data.data.icon_domain);
      setLastUpdate(data.data.last_update);
      return res;
    } catch (error) {}
  };

  const fetchGetBreachesDataWithRefreshToken = async () => {
    await fetchWithRefreshToken(getBreachesData, router, dispatch);
  };

  const getListDomainUsers = async () => {
    try {
      const res = await fetch(`${APIDATAV1}list/domain`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      setDomainUsers(data.data);
      dispatch(setUrlData(data.data));
      return res;
    } catch (error) {
    } finally {
    }
  };

  const fetchGetListDomainUsersWithRefreshToken = async () => {
    await fetchWithRefreshToken(getListDomainUsers, router, dispatch);
  };

  useEffect(() => {
    // getListDomainUsers();
    // getBreachesData();
    fetchGetListDomainUsersWithRefreshToken();
    fetchGetBreachesDataWithRefreshToken();
  }, []);

  const handleChangeUrlOpen = (value) => {
    dispatch(setChangeUrl(true));
  };

  const handleDetails = (item, section, filters) => {
    // dispatch(setDetailState(true));
    dispatch(setDataDetails(item));
    dispatch(setSection(section));
    dispatch(setFilters(filters));
    router.push(`/credentials/dashboard/compromised/detail/${item.id}`, {
      scroll: true,
    });
  };

  const handleRangePicker = (date, datestring) => {
    // console.log("date : ", date);
    // console.log("datestring: ", datestring);
    if (date) {
      // setStartDate(datestring[0]);
      // setEndDate(datestring[1]);
      setStartDate(date[0].format("YYYY-MM-DD"));
      setEndDate(date[1].format("YYYY-MM-DD"));
      switch (selectedButton) {
        case DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE:
          setPage(1);

          if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
            setPageEmployeeBookmark(1);
          } else if (selectedOutlineButton === DETAIL_COMPROMISED_TESTING) {
            setPageEmployeeValidate(1);
          } else {
            setPage(1);
          }
          break;
        case DETAIL_COMPROMISED_COMPROMISE_DEVICES:
          setPageDevices(1);

          if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
            setPageDevicesBookmark(1);
          } else {
            setPageDevices(1);
          }
          break;
        // Add more cases for other buttons if needed
        case DETAIL_COMPROMISED_COMPROMISE_USERS:
          setPageUsers(1);

          if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
            setPageUserBookmark(1);
          } else if (selectedOutlineButton === DETAIL_COMPROMISED_TESTING) {
            setPageUsersValidate(1);
          } else {
            setPageUsers(1);
          }
          break;
        case DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY:
          setPageThirdParty(1);

          if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
            setPageThirdPartyBookmark(1);
          } else if (selectedOutlineButton === DETAIL_COMPROMISED_TESTING) {
            setPageThirdPartyValidate(1);
          } else {
            setPageThirdParty(1);
          }
          break;
        default:
          break;
      }
    } else {
      setStartDate("");
      setEndDate("");
    }
  };

  const handleSearchKeyword = (e) => {
    setInputSearch(e.target.value);
  };

  const handleClickSearch = () => {
    setInitialCheckboxState(false);
    dispatch(clearIds());
    switch (selectedButton) {
      case DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE:
        setPage(1);
        fetchEmployeeDataWithRefreshToken(inputSearch);
        // fetchEmployeeData(inputSearch);
        if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
          setPageEmployeeBookmark(1);
          fetchEmployeeBookmarkDataWithRefreshToken(inputSearch);
          //fetchEmployeeBookmark(inputSearch);
        } else if (selectedOutlineButton === DETAIL_COMPROMISED_TESTING) {
          setPageEmployeeValidate(1);
          fetchEmployeeTestingDataWithRefreshToken(input);
          //fetchEmployeeTesting(inputSearch);
        } else {
          setPage(1);
          fetchEmployeeDataWithRefreshToken(inputSearch);
          // fetchEmployeeData(inputSearch);
        }
        break;
      case DETAIL_COMPROMISED_COMPROMISE_DEVICES:
        setPageDevices(1);
        fetchDevicesDataWithRefreshToken(inputSearch);
        // fetchDevicesData(inputSearch);
        if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
          setPageDevicesBookmark(1);
          fetchDevicesBookmarkWithRefreshToken(inputSearch);
          // fetchDevicesBookmark(inputSearch);
        } else {
          setPageDevices(1);
          fetchDevicesDataWithRefreshToken(inputSearch);
          // fetchDevicesData(inputSearch);
        }
        break;
      // Add more cases for other buttons if needed
      case DETAIL_COMPROMISED_COMPROMISE_USERS:
        setPageUsers(1);
        fetchUsersDataWithRefreshToken(inputSearch);
        // fetchUsersData(inputSearch);
        if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
          setPageUserBookmark(1);
          fetchUserBookmarkDataWithRefreshToken(inputSearch);
          //fetchUserBookmark(inputSearch);
        } else if (selectedOutlineButton === DETAIL_COMPROMISED_TESTING) {
          setPageUsersValidate(1);
          fetchUserTestingDataWithRefreshToken(inputSearch);
          // fetchUserTesting(inputSearch);
        } else {
          setPageUsers(1);
          fetchUsersDataWithRefreshToken(inputSearch);
          // fetchUsersData(inputSearch);
        }
        break;
      case DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY:
        setPageThirdParty(1);
        fetchThirdPartyDataWithRefreshToken(inputSearch);
        // fetchThirdPartyData(inputSearch);
        if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
          setPageThirdPartyBookmark(1);
          fetchThirdPartyBookmarkWithRefreshToken(inputSearch);
          // fetchThirdPartyBookmark(inputSearch);
        } else if (selectedOutlineButton === DETAIL_COMPROMISED_TESTING) {
          setPageThirdPartyValidate(1);
          fetchThirdPartyTestingWithRefreshToken(inputSearch);
          //fetchThirdPartyTesting(inputSearch);
        } else {
          setPageThirdParty(1);
          fetchThirdPartyDataWithRefreshToken(inputSearch);
          // fetchThirdPartyData(inputSearch);
        }
        break;
      default:
        break;
    }
  };

  const handleClickExport = () => {};

  const handleBookmarkConfirm = (dataID, domain) => {
    dispatch(setBookmarkConfirmState(true));
    dispatch(setBookmarkIdData(dataID));
    dispatch(setBookmarkDomainData(domain));
  };

  const handleUnBookmarkConfirm = (dataID, domain) => {
    dispatch(setUnBookmarkConfirmState(true));
    dispatch(setUnBookmarkIdData(dataID));
    dispatch(setUnBookmarkDomainData(domain));
  };

  const mapEmployeeData = (data) => {
    return data.map((item) => ({
      id: item.id,
      date: convertDateFormat(item.datetime_added),
      url: item.url,
      login: item.login,
      pass: item.password,
      strength: CalculatePasswordStrengthWithReturnString(item.password)
        .strengthLabel,
      action: (
        <div className="flex">
          <div
            className="cursor-pointer"
            onClick={() =>
              handleDetails(
                item,
                DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE,
                DETAIL_COMPROMISED_DEFAULT
              )
            }
          >
            <EyeOutlined style={{ fontSize: "18px" }} />
          </div>
          <div
            className="ml-auto mr-auto cursor-pointer"
            onClick={() =>
              handleBookmarkConfirm(
                item.id,
                DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE
              )
            }
          >
            <BookOutlined style={{ fontSize: "18px" }} />
          </div>
        </div>
      ),
    }));
  };

  const mapUsersData = (data) => {
    return data.map((item) => ({
      id: item.id,
      date: convertDateFormat(item.datetime_added),
      url: item.url,
      login: item.login,
      pass: item.password,
      strength: CalculatePasswordStrengthWithReturnString(item.password)
        .strengthLabel,
      action: (
        <div className="flex">
          <div
            className="cursor-pointer"
            onClick={() =>
              handleDetails(
                item,
                DETAIL_COMPROMISED_COMPROMISE_USERS,
                DETAIL_COMPROMISED_DEFAULT
              )
            }
          >
            <EyeOutlined style={{ fontSize: "18px" }} />
          </div>
          <div
            className="ml-auto mr-auto cursor-pointer"
            onClick={() =>
              handleBookmarkConfirm(
                item.id,
                DETAIL_COMPROMISED_COMPROMISE_USERS
              )
            }
          >
            <BookOutlined style={{ fontSize: "18px" }} />
          </div>
        </div>
      ),
    }));
  };

  const mapThirdPartyData = (data) => {
    return data.map((item) => ({
      id: item.id,
      date: convertDateFormat(item.datetime_added),
      url: item.url,
      login: item.login,
      pass: item.password,
      strength: CalculatePasswordStrengthWithReturnString(item.password)
        .strengthLabel,
      action: (
        <div className="flex">
          <div
            className="cursor-pointer"
            onClick={() =>
              handleDetails(
                item,
                DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY,
                DETAIL_COMPROMISED_DEFAULT
              )
            }
          >
            <EyeOutlined style={{ fontSize: "18px" }} />
          </div>
          <div
            className="ml-auto mr-auto cursor-pointer"
            onClick={() =>
              handleBookmarkConfirm(
                item.id,
                DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY
              )
            }
          >
            <BookOutlined style={{ fontSize: "18px" }} />
          </div>
        </div>
      ),
    }));
  };

  const mapDevicesData = (data) => {
    return data.map((item) => ({
      id: item.id,
      date: convertDateFormat(item.datetime_added),
      devices_name: item.computer_name,
      ip: item.ip,
      action: (
        <div className="flex">
          <div
            className="cursor-pointer"
            onClick={() =>
              handleDetails(
                item,
                DETAIL_COMPROMISED_COMPROMISE_DEVICES,
                DETAIL_COMPROMISED_DEFAULT
              )
            }
          >
            <EyeOutlined style={{ fontSize: "18px" }} />
          </div>
          <div
            className="ml-auto mr-auto cursor-pointer"
            onClick={() =>
              handleBookmarkConfirm(
                item.id,
                DETAIL_COMPROMISED_COMPROMISE_DEVICES
              )
            }
          >
            <BookOutlined style={{ fontSize: "18px" }} />
          </div>
        </div>
      ),
    }));
  };

  const handleSelectValidation = (value, id, status) => {
    setSelectValidasi(value);

    // UpdateValidateTesting(id, value, status);
    fetchUpdateValidateTestingWithRefreshToken(id, value, status);
  };

  const UpdateValidateTesting = async (id, validasi, status) => {
    try {
      dispatch(setLoadingState(true));
      const res = await fetch(`${APIDATAV1}status/domain/${status}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status_validasi: validasi,
        }),
      });

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      if (data.success === false) {
        // throw new Error("");
        throw res;
      }

      if (data.success) {
        setValidasiSuccess(true);
        return res;
      }
    } catch (error) {
      setValidasiSuccess(false);
      // return res
      return error;
    } finally {
      dispatch(setLoadingState(false));
      setTimeout(() => {
        setValidasiSuccess(null);
      }, 5000);
    }
  };

  const fetchUpdateValidateTestingWithRefreshToken = async (
    id,
    validasi,
    status
  ) => {
    await fetchWithRefreshToken(
      UpdateValidateTesting,
      router,
      dispatch,
      id,
      validasi,
      status
    );
  };

  const GetOutlineTotalDataCompromiseOutlineButton = (selectButton) => {
    if (selectButton === DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE) {
      return employeeData && employeeData.count;
    } else if (selectButton === DETAIL_COMPROMISED_COMPROMISE_USERS) {
      return usersData && usersData.count;
    } else if (selectButton === DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY) {
      return thirdPartyData && thirdPartyData.count;
    } else {
      return devicesData && devicesData.count;
    }
  };

  const GetOutlineTotalDataValidatedOutlineButton = (selectButton) => {
    if (selectButton === DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE) {
      return employeeValidatedData && employeeValidatedData.count;
    } else if (selectButton === DETAIL_COMPROMISED_COMPROMISE_USERS) {
      return usersValidatedData && usersValidatedData.count;
    } else {
      return thirdPartyValidatedData && thirdPartyValidatedData.count;
    }
    // else if (selectButton === DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY) {
    //   return thirdPartyData && thirdPartyData.count
    // } else {
    //   return devicesData && devicesData.count
    // }
  };

  const GetOutlineTotalDataBookmarkedOutlineButton = (selectButton) => {
    if (selectButton === DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE) {
      return employeeBookmarkData && employeeBookmarkData.size;
    } else if (selectButton === DETAIL_COMPROMISED_COMPROMISE_USERS) {
      return usersBookmarkData && usersBookmarkData.count;
    } else if (selectButton === DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY) {
      return thirdPartyBookmarkData && thirdPartyBookmarkData.count;
    } else {
      return devicesBookmarkData && devicesBookmarkData.count;
    }
  };

  // Start of: Fetch Data compromised

  const fetchEmployeeData = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));

      if (!filterApplied && (keyword || startDate || endDate)) {
        setPage(1);
        setFilterApplied(true);
      }

      const res = await fetch(
        `${APIDATAV1}compromised/employee?page=${page}&start_date=${startDate}&end_date=${endDate}&search=${keyword}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      if (data.data === null) {
        throw res;
      }

      if (data.data) {
        setTotalEmployee(data.count_data);
        setTotalRows(data.count_data);
        const mappedEmployeedata = mapEmployeeData(data.data);
        // setDataSource(mappedEmployeedata);
        setEmployeeData({
          data: mappedEmployeedata,
          count: data.count_data,
          size: data.size,
        });
        return res;
      }
    } catch (error) {
      // setDataSource(null);
      setEmployeeData(null);
      console.log("inside catch: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchEmployeeDataWithRefreshToken = async (keyword = "") => {
    await fetchWithRefreshToken(fetchEmployeeData, router, dispatch, keyword);
  };

  const fetchUsersData = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));

      if (!filterApplied && (keyword || startDate || endDate)) {
        setPageUsers(1);
        setFilterApplied(true);
      }

      const res = await fetch(
        `${APIDATAV1}compromised/users?page=${pageUsers}&start_date=${startDate}&end_date=${endDate}&search=${keyword}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      if (data.data === null) {
        // throw new Error("");
        throw res;
      }

      if (data.data) {
        setTotalUsers(data.count_data);
        setTotalRows(data.count_data);
        const mappedUsersData = mapUsersData(data.data);
        // setDataSource(mappedUsersData);
        setUsersData({
          data: mappedUsersData,
          count: data.count_data,
          size: data.size,
        });
        return res;
      }
    } catch (error) {
      // setDataSource(null);
      setUsersData(null);
      // return res
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchUsersDataWithRefreshToken = async (keyword = "") => {
    await fetchWithRefreshToken(fetchUsersData, router, dispatch, keyword);
  };

  const fetchThirdPartyData = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));

      if (!filterApplied && (keyword || startDate || endDate)) {
        setPageThirdParty(1);
        setFilterApplied(true);
      }

      const res = await fetch(
        `${APIDATAV1}compromised/thirdparty?page=${pageThirdParty}&start_date=${startDate}&end_date=${endDate}&search=${keyword}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      if (data.data === null) {
        // throw new Error("");
        throw res;
      }

      if (data.data) {
        setTotalThirdParty(data.count_data);
        setTotalRows(data.count_data);
        const mappedThirdParty = mapThirdPartyData(data.data);
        // setDataSource(mappedThirdParty);
        setThirdPartyData({
          data: mappedThirdParty,
          count: data.count_data,
          size: data.size,
        });
        return res;
      }
    } catch (error) {
      // setDataSource(null);
      setThirdPartyData(null);
      // return res
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchThirdPartyDataWithRefreshToken = async (keyword = "") => {
    await fetchWithRefreshToken(fetchThirdPartyData, router, dispatch, keyword);
  };

  const fetchDevicesData = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));

      if (!filterApplied && (keyword || startDate || endDate)) {
        setPageDevices(1);
        setFilterApplied(true);
      }

      const res = await fetch(
        `${APIDATAV1}compromised/devices?page=${pageDevices}&start_date=${startDate}&end_date=${endDate}&search=${keyword}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      if (data.data === null) {
        // throw new Error("");
        throw res;
      }

      if (data.data) {
        setTotalDevice(data.count_data);
        setTotalRows(data.count_data);
        const mappedDevicesData = mapDevicesData(data.data);
        // setDataSource(mappedDevicesData);
        setDevicesData({
          data: mappedDevicesData,
          count: data.count_data,
          size: data.size,
        });
        return res;
      }
    } catch (error) {
      // setDataSource(null);
      setDevicesData(null);
      // return res
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchDevicesDataWithRefreshToken = async (keyword = "") => {
    await fetchWithRefreshToken(fetchDevicesData, router, dispatch, keyword);
  };

  const fetchEmployeeBookmark = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));

      if (!filterApplied && (keyword || startDate || endDate)) {
        setPageEmployeeBookmark(1);
        setFilterApplied(true);
      }

      const res = await fetch(
        `${APIDATAV1}status/domain/employee?status=bookmark&page=${pageEmployeeBookmark}&start_date=${startDate}&end_date=${endDate}&search=${keyword}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      if (data.data === null) {
        // throw new Error("");
        throw res;
      }

      if (data.data) {
        setEmployeeBookmarkData({
          data: data.data,
          count: data.count_data,
          size: data.size,
        });

        return res;
      }
    } catch (error) {
      setEmployeeBookmarkData(null);
      // return res
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchEmployeeBookmarkDataWithRefreshToken = async (keyword = "") => {
    await fetchWithRefreshToken(
      fetchEmployeeBookmark,
      router,
      dispatch,
      keyword
    );
  };

  const fetchEmployeeTesting = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));

      if (!filterApplied && (keyword || startDate || endDate)) {
        setPageEmployeeValidate(1);
        setFilterApplied(true);
      }

      const res = await fetch(
        `${APIDATAV1}status/domain/employee?status=testing&page=${pageEmployeeValidate}&start_date=${startDate}&end_date=${endDate}&search=${keyword}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      console.log("employee data testing: ", data);

      if (data.data === null) {
        // throw new Error("");
        throw res;
      }

      if (data.data) {
        setEmployeeValidatedData({
          data: data.data,
          count: data.count_data,
          size: data.size,
        });
        return res;
      }
    } catch (error) {
      setEmployeeValidatedData(null);
      // return res
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchEmployeeTestingDataWithRefreshToken = async (keyword = "") => {
    await fetchWithRefreshToken(
      fetchEmployeeTesting,
      router,
      dispatch,
      keyword
    );
  };

  const fetchUserBookmark = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));

      if (!filterApplied && (keyword || startDate || endDate)) {
        setPageUserBookmark(1);
        setFilterApplied(true);
      }

      const res = await fetch(
        `${APIDATAV1}status/domain/users?status=bookmark&page=${pageUsersBookmark}&start_date=${startDate}&end_date=${endDate}&search=${keyword}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      if (data.data === null) {
        // throw new Error("");
        throw res;
      }

      if (data.data) {
        setUsersBookmarkData({
          data: data.data,
          count: data.count_data,
          size: data.size,
        });
        return res;
      }
    } catch (error) {
      setUsersBookmarkData(null);
      // return res
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchUserBookmarkDataWithRefreshToken = async (keyword = "") => {
    await fetchWithRefreshToken(fetchUserBookmark, router, dispatch, keyword);
  };

  const fetchUserTesting = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));

      if (!filterApplied && (keyword || startDate || endDate)) {
        setPageUsersValidate(1);
        setFilterApplied(true);
      }

      const res = await fetch(
        `${APIDATAV1}status/domain/users?status=testing&page=${pageUsersValidate}&start_date=${startDate}&end_date=${endDate}&search=${keyword}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      if (data.data === null) {
        // throw new Error("");
        throw res;
      }

      if (data.data) {
        setUsersValidatedData({
          data: data.data,
          count: data.count_data,
          size: data.size,
        });
        return res;
      }
    } catch (error) {
      setUsersValidatedData(null);
      // return res
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchUserTestingDataWithRefreshToken = async (keyword = "") => {
    await fetchWithRefreshToken(fetchUserTesting, router, dispatch, keyword);
  };

  const fetchThirdPartyBookmark = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));

      if (!filterApplied && (keyword || startDate || endDate)) {
        setPageThirdPartyBookmark(1);
        setFilterApplied(true);
      }

      const res = await fetch(
        `${APIDATAV1}status/domain/thirdparty?status=bookmark&page=${pageThirdPartyBookmark}&start_date=${startDate}&end_date=${endDate}&search=${keyword}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      if (data.data === null) {
        // throw new Error("");
        throw res;
      }

      if (data.data) {
        setThirdPartyBookmarkData({
          data: data.data,
          count: data.count_data,
          size: data.size,
        });
        return res;
      }
    } catch (error) {
      setThirdPartyBookmarkData(null);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchThirdPartyBookmarkWithRefreshToken = async (keyword = "") => {
    await fetchWithRefreshToken(
      fetchThirdPartyBookmark,
      router,
      dispatch,
      keyword
    );
  };

  const fetchThirdPartyTesting = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));

      if (!filterApplied && (keyword || startDate || endDate)) {
        setPageThirdPartyValidate(1);
        setFilterApplied(true);
      }

      const res = await fetch(
        `${APIDATAV1}status/domain/thirdparty?status=testing&page=${pageThirdPartyValidate}&start_date=${startDate}&end_date=${endDate}&search=${keyword}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      if (data.data === null) {
        // throw new Error("");
        throw res;
      }

      if (data.data) {
        setThirdPartyValidatedData({
          data: data.data,
          count: data.count_data,
          size: data.size,
        });
        return res;
      }
    } catch (error) {
      setThirdPartyValidatedData(null);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchThirdPartyTestingWithRefreshToken = async (keyword = "") => {
    await fetchWithRefreshToken(
      fetchThirdPartyTesting,
      router,
      dispatch,
      keyword
    );
  };

  const fetchDevicesBookmark = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));

      if (!filterApplied && (keyword || startDate || endDate)) {
        setPageDevicesBookmark(1);
        setFilterApplied(true);
      }

      const res = await fetch(
        `${APIDATAV1}status/domain/devices/boomark?page=${pageDevicesBookmark}&start_date=${startDate}&end_date=${endDate}&search=${keyword}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      if (data.data === null) {
        // throw new Error("");
        throw res;
      }

      if (data.data) {
        setDevicesBookmarkData({
          data: data.data,
          count: data.count_data,
          size: data.size,
        });
        return res;
      }
    } catch (error) {
      setDevicesBookmarkData(null);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchDevicesBookmarkWithRefreshToken = async (keyword = "") => {
    await fetchWithRefreshToken(
      fetchDevicesBookmark,
      router,
      dispatch,
      keyword
    );
  };

  // Start of: Export to CSV

  const fetchExportToCsvEmployeeDefault = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));

      if (!filterApplied && (keyword || startDate || endDate)) {
        setPage(1);
        setFilterApplied(true);
      }

      const res = await fetch(
        `${APIDATAV1}compromised/export/csv/employee?page=${page}&start_date=${startDate}&end_date=${endDate}&search=${keyword}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const blob = await res.blob();
      // Check if the `window` object is defined (browser environment)
      if (typeof window !== "undefined") {
        const downloadUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = downloadUrl;
        if (!keyword || !startDate || !endDate) {
          link.download = `Data-Compromised-Employee-default-page-${page}.csv`; // Set the desired file name
        }
        if (keyword) {
          link.download = `Data-Compromised-Employee-keyword-${keyword}-page-${page}.csv`;
        }
        if (startDate || endDate) {
          link.download = `Data-Compromised-Employee-Date Range-${startDate} - ${endDate}-page-${page}.csv`;
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return res;
      } else {
        console.log(
          "Server-side rendering detected, cannot create download link"
        );
      }
    } catch (error) {
      console.log("Error export to CSV");
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchExportToCSVEmployeeDefaultWithRefreshToken = async (
    keyword = ""
  ) => {
    await fetchWithRefreshToken(
      fetchExportToCsvEmployeeDefault,
      router,
      dispatch,
      keyword
    );
  };

  const fetchExportToCsvEmployeeTested = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));

      if (!filterApplied && (keyword || startDate || endDate)) {
        setPageEmployeeValidate(1);
        setFilterApplied(true);
      }

      const res = await fetch(
        `${APIDATAV1}compromised/export/csv/employee?page=${pageEmployeeValidate}&start_date=${startDate}&end_date=${endDate}&search=${keyword}&status=testing`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const blob = await res.blob();

      // Check if the `window` object is defined (browser environment)
      if (typeof window !== "undefined") {
        const downloadUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = downloadUrl;
        if (!keyword || !startDate || !endDate) {
          link.download = `Data-Compromised-Employee-validated-page-${pageEmployeeValidate}.csv`; // Set the desired file name
        }
        if (keyword) {
          link.download = `Data-Compromised-Employee-keyword-${keyword}-validated-page-${pageEmployeeValidate}.csv`;
        }
        if (startDate || endDate) {
          link.download = `Data-Compromised-Employee-Date Range-${startDate} - ${endDate}-validated-page-${pageEmployeeValidate}.csv`;
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return res;
      }
    } catch (error) {
      console.log("Error export to CSV");
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchExportToCSVEmployeeTestedWithRefreshToken = async (
    keyword = ""
  ) => {
    await fetchWithRefreshToken(
      fetchExportToCsvEmployeeTested,
      router,
      dispatch,
      keyword
    );
  };

  const fetchExportToCsvEmployeeBookmark = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));

      if (!filterApplied && (keyword || startDate || endDate)) {
        setPageEmployeeBookmark(1);
        setFilterApplied(true);
      }

      const res = await fetch(
        `${APIDATAV1}compromised/export/csv/employee?page=${pageEmployeeBookmark}&start_date=${startDate}&end_date=${endDate}&search=${keyword}&status=bookmark`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const blob = await res.blob();

      // Check if the `window` object is defined (browser environment)
      if (typeof window !== "undefined") {
        const downloadUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = downloadUrl;
        if (!keyword || !startDate || !endDate) {
          link.download = `Data-Compromised-Employee-bookmark-page-${pageEmployeeBookmark}.csv`; // Set the desired file name
        }
        if (keyword) {
          link.download = `Data-Compromised-Employee-keyword-${keyword}-bookmark-page-${pageEmployeeBookmark}.csv`;
        }
        if (startDate || endDate) {
          link.download = `Data-Compromised-Employee-Date Range-${startDate} - ${endDate}-bookmark-page-${pageEmployeeBookmark}.csv`;
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return res;
      }
    } catch (error) {
      console.log("Error export to CSV");
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchExportToCSVEmployeeBookmarkWithRefreshToken = async (
    keyword = ""
  ) => {
    await fetchWithRefreshToken(
      fetchExportToCsvEmployeeBookmark,
      router,
      dispatch,
      keyword
    );
  };

  const fetchExportToCsvUserDefault = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));

      if (!filterApplied && (keyword || startDate || endDate)) {
        setPageUsers(1);
        setFilterApplied(true);
      }

      const res = await fetch(
        `${APIDATAV1}compromised/export/csv/user?page=${pageUsers}&start_date=${startDate}&end_date=${endDate}&search=${keyword}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const blob = await res.blob();

      // Check if the `window` object is defined (browser environment)
      if (typeof window !== "undefined") {
        const downloadUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = downloadUrl;
        if (!keyword || !startDate || !endDate) {
          link.download = `Data-Compromised-Users-default-page-${pageUsers}.csv`; // Set the desired file name
        }
        if (keyword) {
          link.download = `Data-Compromised-Users-keyword-${keyword}-page-${pageUsers}.csv`;
        }
        if (startDate || endDate) {
          link.download = `Data-Compromised-Users-Date Range-${startDate} - ${endDate}-page-${pageUsers}.csv`;
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return res;
      }
    } catch (error) {
      console.log("Error export to CSV");
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchExportToCSVUserDefaultWithRefreshToken = async (keyword = "") => {
    await fetchWithRefreshToken(
      fetchExportToCsvUserDefault,
      router,
      dispatch,
      keyword
    );
  };

  const fetchExportToCsvUserTested = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));

      if (!filterApplied && (keyword || startDate || endDate)) {
        setPageUsersValidate(1);
        setFilterApplied(true);
      }

      const res = await fetch(
        `${APIDATAV1}compromised/export/csv/user?page=${pageUsersValidate}&start_date=${startDate}&end_date=${endDate}&search=${keyword}&status=testing`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const blob = await res.blob();

      // Check if the `window` object is defined (browser environment)
      if (typeof window !== "undefined") {
        const downloadUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = downloadUrl;
        if (!keyword || !startDate || !endDate) {
          link.download = `Data-Compromised-Users-validate-page-${pageUsersValidate}.csv`; // Set the desired file name
        }
        if (keyword) {
          link.download = `Data-Compromised-Users-keyword-${keyword}-validate-page-${pageUsersValidate}.csv`;
        }
        if (startDate || endDate) {
          link.download = `Data-Compromised-Users-Date Range-${startDate} - ${endDate}-validate-page-${pageUsersValidate}.csv`;
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return res;
      }
    } catch (error) {
      console.log("Error export to CSV");
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchExportToCSVUserTestedWithRefreshToken = async (keyword = "") => {
    await fetchWithRefreshToken(
      fetchExportToCsvUserTested,
      router,
      dispatch,
      keyword
    );
  };

  const fetchExportToCsvUserBookmark = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));

      if (!filterApplied && (keyword || startDate || endDate)) {
        setPageUserBookmark(1);
        setFilterApplied(true);
      }

      const res = await fetch(
        `${APIDATAV1}compromised/export/csv/user?page=${pageUsersBookmark}&start_date=${startDate}&end_date=${endDate}&search=${keyword}&status=bookmark`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const blob = await res.blob();

      // Check if the `window` object is defined (browser environment)
      if (typeof window !== "undefined") {
        const downloadUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = downloadUrl;
        if (!keyword || !startDate || !endDate) {
          link.download = `Data-Compromised-Users-bookmark-page-${pageUsersBookmark}.csv`; // Set the desired file name
        }
        if (keyword) {
          link.download = `Data-Compromised-Users-keyword-${keyword}-bookmark-page-${pageUsersBookmark}.csv`;
        }
        if (startDate || endDate) {
          link.download = `Data-Compromised-Users-Date Range-${startDate} - ${endDate}-bookmark-page-${pageUsersBookmark}.csv`;
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return res;
      }
    } catch (error) {
      console.log("Error export to CSV");
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchExportToCSVUserBookmarkWithRefreshToken = async (keyword = "") => {
    await fetchWithRefreshToken(
      fetchExportToCsvUserBookmark,
      router,
      dispatch,
      keyword
    );
  };

  const fetchExportToCsvThirdPartyDefault = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));

      if (!filterApplied && (keyword || startDate || endDate)) {
        setPageThirdParty(1);
        setFilterApplied(true);
      }

      const res = await fetch(
        `${APIDATAV1}compromised/export/csv/thirdparty?page=${pageThirdParty}&start_date=${startDate}&end_date=${endDate}&search=${keyword}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const blob = await res.blob();

      // Check if the `window` object is defined (browser environment)
      if (typeof window !== "undefined") {
        const downloadUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = downloadUrl;
        if (!keyword || !startDate || !endDate) {
          link.download = `Data-Compromised-ThirdParty-default-page-${pageThirdParty}.csv`; // Set the desired file name
        }
        if (keyword) {
          link.download = `Data-Compromised-ThirdParty-keyword-${keyword}-page-${pageThirdParty}.csv`;
        }
        if (startDate || endDate) {
          link.download = `Data-Compromised-ThirdParty-Date Range-${startDate} - ${endDate}-page-${pageThirdParty}.csv`;
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return res;
      }
    } catch (error) {
      console.log("Error export to CSV");
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchExportToCSVThirdPartyDefaultWithRefreshToken = async (
    keyword = ""
  ) => {
    await fetchWithRefreshToken(
      fetchExportToCsvThirdPartyDefault,
      router,
      dispatch,
      keyword
    );
  };

  const fetchExportToCsvThirdPartyTested = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));

      if (!filterApplied && (keyword || startDate || endDate)) {
        setPageThirdPartyValidate(1);
        setFilterApplied(true);
      }

      const res = await fetch(
        `${APIDATAV1}compromised/export/csv/thirdparty?page=${pageThirdPartyValidate}&start_date=${startDate}&end_date=${endDate}&search=${keyword}&status=testing`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const blob = await res.blob();

      // Check if the `window` object is defined (browser environment)
      if (typeof window !== "undefined") {
        const downloadUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = downloadUrl;
        if (!keyword || !startDate || !endDate) {
          link.download = `Data-Compromised-ThirdParty-validate-page-${pageThirdPartyValidate}.csv`; // Set the desired file name
        }
        if (keyword) {
          link.download = `Data-Compromised-ThirdParty-keyword-${keyword}-validate-page-${pageThirdPartyValidate}.csv`;
        }
        if (startDate || endDate) {
          link.download = `Data-Compromised-ThirdParty-Date Range-${startDate} - ${endDate}-validate-page-${pageThirdPartyValidate}.csv`;
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return res;
      }
    } catch (error) {
      console.log("Error export to CSV");
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchExportToCSVThirdPartyTestedWithRefreshToken = async (
    keyword = ""
  ) => {
    await fetchWithRefreshToken(
      fetchExportToCsvThirdPartyTested,
      router,
      dispatch,
      keyword
    );
  };

  const fetchExportToCsvThirdPartyBookmark = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));

      if (!filterApplied && (keyword || startDate || endDate)) {
        setPageThirdPartyBookmark(1);
        setFilterApplied(true);
      }

      const res = await fetch(
        `${APIDATAV1}compromised/export/csv/thirdparty?page=${pageThirdPartyBookmark}&start_date=${startDate}&end_date=${endDate}&search=${keyword}&status=bookmark`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const blob = await res.blob();

      // Check if the `window` object is defined (browser environment)
      if (typeof window !== "undefined") {
        const downloadUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = downloadUrl;
        if (!keyword || !startDate || !endDate) {
          link.download = `Data-Compromised-ThirdParty-bookmark-page-${pageThirdPartyBookmark}.csv`; // Set the desired file name
        }
        if (keyword) {
          link.download = `Data-Compromised-ThirdParty-keyword-${keyword}-bookmark-page-${pageThirdPartyBookmark}.csv`;
        }
        if (startDate || endDate) {
          link.download = `Data-Compromised-ThirdParty-Date Range-${startDate} - ${endDate}-bookmark-page-${pageThirdPartyBookmark}.csv`;
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return res;
      }
    } catch (error) {
      console.log("Error export to CSV");
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchExportToCSVThirdPartyBookmarkWithRefreshToken = async (
    keyword = ""
  ) => {
    await fetchWithRefreshToken(
      fetchExportToCsvThirdPartyBookmark,
      router,
      dispatch,
      keyword
    );
  };

  const fetchExportToCsvDevicesDefault = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));

      if (!filterApplied && (keyword || startDate || endDate)) {
        setPageDevices(1);
        setFilterApplied(true);
      }

      const res = await fetch(
        `${APIDATAV1}compromised/export/csv/device?page=${pageDevices}&start_date=${startDate}&end_date=${endDate}&search=${keyword}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const blob = await res.blob();

      // Check if the `window` object is defined (browser environment)
      if (typeof window !== "undefined") {
        const downloadUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = downloadUrl;
        if (!keyword || !startDate || !endDate) {
          link.download = `Data-Compromised-Devices-default-page-${pageDevices}.csv`; // Set the desired file name
        }
        if (keyword) {
          link.download = `Data-Compromised-Devices-keyword-${keyword}-page-${pageDevices}.csv`;
        }
        if (startDate || endDate) {
          link.download = `Data-Compromised-Devices-Date Range-${startDate} - ${endDate}-page-${pageDevices}.csv`;
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return res;
      }
    } catch (error) {
      console.log("Error export to CSV");
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchExportToCSVDevicesDefaultWithRefreshToken = async (
    keyword = ""
  ) => {
    await fetchWithRefreshToken(
      fetchExportToCsvDevicesDefault,
      router,
      dispatch,
      keyword
    );
  };

  const fetchExportToCsvDevicesBookmark = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));

      if (!filterApplied && (keyword || startDate || endDate)) {
        setPageDevicesBookmark(1);
        setFilterApplied(true);
      }

      const res = await fetch(
        `${APIDATAV1}compromised/export/csv/device?page=${pageDevicesBookmark}&start_date=${startDate}&end_date=${endDate}&search=${keyword}&status=bookmark`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const blob = await res.blob();

      // Check if the `window` object is defined (browser environment)
      if (typeof window !== "undefined") {
        const downloadUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = downloadUrl;
        if (!keyword || !startDate || !endDate) {
          link.download = `Data-Compromised-Devices-Bookmark-page-${pageDevicesBookmark}.csv`; // Set the desired file name
        }
        if (keyword) {
          link.download = `Data-Compromised-Devices-keyword-${keyword}-Bookmark-page-${pageDevicesBookmark}.csv`;
        }
        if (startDate || endDate) {
          link.download = `Data-Compromised-Devices-Date Range-${startDate} - ${endDate}-Bookmark-page-${pageDevicesBookmark}.csv`;
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return res;
      }
    } catch (error) {
      console.log("Error export to CSV");
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchExportToCSVDevicesBookmarkWithRefreshToken = async (
    keyword = ""
  ) => {
    await fetchWithRefreshToken(
      fetchExportToCsvDevicesBookmark,
      router,
      dispatch,
      keyword
    );
  };

  // End of: Export to CSV

  const handleButtonClick = (value) => {
    setSelectedButton(value.target.name);
    setInputSearch("");
    setStartDate("");
    setEndDate("");
    setTotalRows("");
    setSelectedOutlineButton(DETAIL_COMPROMISED_DEFAULT);
    setInitialCheckboxState(false);
    dispatch(clearIds());
  };

  const handleButtonOutlineClick = (value) => {
    setSelectedOutlineButton(value.target.name);
    setInputSearch("");
    setStartDate("");
    setEndDate("");
    setTotalRows("");
    setInitialCheckboxState(false);
    dispatch(clearIds());
  };

  // useEffect(() => {
  // fetchEmployeeDataWithRefreshToken(inputSearch)
  // fetchEmployeeData(inputSearch);
  //  fetchUsersDataWithRefreshToken(inputSearch)
  //   fetchUsersData(inputSearch);
  // fetchThirdPartyDataWithRefreshToken(inputSearch)//
  // fetchThirdPartyData(inputSearch);
  // fetchDevicesDataWithRefreshToken(inputSearch)//
  // fetchDevicesData(inputSearch);
  // }, []);

  // useEffect(() => {
  //   if (selectedButton === DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE) {
  //     fetchEmployeeData();
  //     fetchEmployeeBookmark();
  //     fetchEmployeeTesting();
  //   } else if (selectedButton === DETAIL_COMPROMISED_COMPROMISE_USERS) {
  //     fetchUsersData();
  //     fetchUserBookmark();
  //     fetchUserTesting();
  //   } else if (selectedButton === DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY) {
  //     fetchThirdPartyData();
  //     fetchThirdPartyBookmark();
  //     fetchThirdPartyTesting();
  //   } else {
  //     fetchDevicesData();
  //     fetchDevicesBookmark();
  //   }
  // }, [selectedButton]);

  // Start of: Timer

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000); // Update every second

    setIntervalRef(interval);

    return () => {
      clearInterval(interval); // Clean up the interval on unmount
    };
  }, []);

  // End of: Timer

  useEffect(() => {
    // fetchEmployeeData();
    setInitialCheckboxState(false);
    setSelectValidasi(null);
    dispatch(clearIds());
    switch (selectedButton) {
      case DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE:
        fetchEmployeeDataWithRefreshToken(inputSearch);
        // fetchEmployeeData(inputSearch);
        if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
          fetchEmployeeBookmarkDataWithRefreshToken(inputSearch);
          //fetchEmployeeBookmark(inputSearch);
        } else if (selectedOutlineButton === DETAIL_COMPROMISED_TESTING) {
          fetchEmployeeTestingDataWithRefreshToken(inputSearch);
          //fetchEmployeeTesting(inputSearch);
        } else {
          fetchEmployeeDataWithRefreshToken(inputSearch);
          // fetchEmployeeData(inputSearch);
        }
        break;
      case DETAIL_COMPROMISED_COMPROMISE_DEVICES:
        fetchDevicesDataWithRefreshToken(inputSearch);
        // fetchDevicesData(inputSearch);
        if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
          fetchDevicesBookmarkWithRefreshToken(inputSearch);
          // fetchDevicesBookmark(inputSearch);
        } else {
          fetchDevicesDataWithRefreshToken(inputSearch);
          // fetchDevicesData(inputSearch);
        }
        break;
      // Add more cases for other buttons if needed
      case DETAIL_COMPROMISED_COMPROMISE_USERS:
        fetchUsersDataWithRefreshToken(inputSearch);
        // fetchUsersData(inputSearch);
        if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
          fetchUserBookmarkDataWithRefreshToken(inputSearch);
          //fetchUserBookmark(inputSearch);
        } else if (selectedOutlineButton === DETAIL_COMPROMISED_TESTING) {
          fetchUserTestingDataWithRefreshToken(inputSearch);
          // fetchUserTesting(inputSearch);
        } else {
          fetchUsersDataWithRefreshToken(inputSearch);
          // fetchUsersData(inputSearch);
        }
        break;
      case DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY:
        fetchThirdPartyDataWithRefreshToken(inputSearch);
        // fetchThirdPartyData(inputSearch);
        if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
          fetchThirdPartyBookmarkWithRefreshToken(inputSearch);
          // fetchThirdPartyBookmark(inputSearch);
        } else if (selectedOutlineButton === DETAIL_COMPROMISED_TESTING) {
          fetchThirdPartyTestingWithRefreshToken(inputSearch);
          //fetchThirdPartyTesting(inputSearch);
        } else {
          fetchThirdPartyDataWithRefreshToken(inputSearch);
          // fetchThirdPartyData(inputSearch);
        }
        break;
      default:
        break;
    }
  }, [
    selectedButton,
    endDate,
    startDate,
    bookmarkSuccessState,
    unbookmarkSuccessState,
    selectedOutlineButton,
    selectValidasi,
    statusStateMultipleBookmark,
    statusStateMultipleValidated,
    page,
    pageUsers,
    pageThirdParty,
    pageDevices,
    pageEmployeeBookmark,
    pageEmployeeValidate,
    pageUsersValidate,
    pageUsersBookmark,
    pageThirdPartyBookmark,
    pageThirdPartyValidate,
    pageDevicesBookmark,
  ]);

  // End of: Fetch Data compromised

  return (
    <main>
      <h1 className="text-heading-2 text-black mb-4">Compromised</h1>
      <div className="bg-white  p-12 rounded-xl shadow-md">
        <div className="flex items-center">
          <div>
            <div className="h-[32px] w-[32px] bg-input-container flex">
              <Image
                width={32}
                height={32}
                src={iconBreaches && iconBreaches}
                alt="Icon Logo Users"
                // style={{
                //   objectFit: "cover",
                //   backgroundSize: "cover",
                //   width: "100%",
                // }}
              />
              <h1 className="text-heading-3 ml-4">
                {urlBreaches && urlBreaches}
              </h1>
            </div>
            <div className="">
              {/* <h2 className="text-LG-normal text-text-description mt-2">
                Last update: {lastUpdate && lastUpdate}
              </h2> */}
              <p className="text-LG-normal text-text-description mt-2">
                This Company is scanned by SectorOne per{" "}
                <span className="text-primary-base">
                  {" "}
                  {currentTime.format("DD MMMM YYYY HH:mm:ss")}
                </span>{" "}
              </p>
            </div>
          </div>
          <div className="flex flex-grow justify-end items-center">
            <ChangeUrlButton
              onClick={handleChangeUrlOpen}
              disabled={domainUsers && domainUsers.length > 1}
            >
              {domainUsers && domainUsers.length > 1 ? "Change URL" : "No Data"}
            </ChangeUrlButton>
          </div>
        </div>
        <div className="mt-8">
          {/* <OverviewCard
            descriptions={"Corporate credentials found"}
            image={"/images/sector_image_magnifier.svg"}
            total={breachesAll && breachesAll}
          />
          <OverviewCard
            descriptions={"Employee compromised"}
            image={"/images/sector_image_location-like.svg"}
            total={employeeBreaches && employeeBreaches}
          />
          <OverviewCard
            descriptions={"User compromised"}
            image={"/images/sector_image_user-like.svg"}
            total={usersBreaches && usersBreaches}
          /> */}
          <Chart
            options={options}
            series={series}
            type="area"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
      <section className="mt-10">
        <h1 className="text-heading-4 text-black">Detail compromised</h1>
        <div className="mt-4 bg-white  rounded-lg">
          <section className="py-8 mx-8 border-b-2 border-input-border ">
            <CompromiseButton
              isActive={
                selectedButton === DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE
              }
              // total={employeeData && employeeData.count}
              value={"Employee"}
              onClick={handleButtonClick}
              nameData={DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE}
            />

            <CompromiseButton
              isActive={selectedButton === DETAIL_COMPROMISED_COMPROMISE_USERS}
              // total={usersData && usersData.count}
              value={"User"}
              onClick={handleButtonClick}
              nameData={DETAIL_COMPROMISED_COMPROMISE_USERS}
            />

            <CompromiseButton
              isActive={
                selectedButton === DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY
              }
              // total={totalThirdParty && totalThirdParty}
              value={"Third-party"}
              onClick={handleButtonClick}
              nameData={DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY}
            />

            <CompromiseButton
              isActive={
                selectedButton === DETAIL_COMPROMISED_COMPROMISE_DEVICES
              }
              // total={totalDevice && totalDevice}
              value={"Device"}
              onClick={handleButtonClick}
              nameData={DETAIL_COMPROMISED_COMPROMISE_DEVICES}
            />
          </section>
          <section className="p-8">
            <OutlineButton
              isActive={selectedOutlineButton === DETAIL_COMPROMISED_DEFAULT}
              // total={GetOutlineTotalDataCompromiseOutlineButton(selectedButton)}
              value={"Data compromise "}
              onClick={handleButtonOutlineClick}
              nameData={DETAIL_COMPROMISED_DEFAULT}
            />
            {selectedButton !== DETAIL_COMPROMISED_COMPROMISE_DEVICES && (
              <OutlineButton
                isActive={selectedOutlineButton === DETAIL_COMPROMISED_TESTING}
                // total={GetOutlineTotalDataValidatedOutlineButton(
                //   selectedButton
                // )}
                value={"Validated "}
                onClick={handleButtonOutlineClick}
                nameData={DETAIL_COMPROMISED_TESTING}
              />
            )}
            <OutlineButton
              isActive={selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK}
              // total={GetOutlineTotalDataBookmarkedOutlineButton(selectedButton)}
              value={"Bookmark "}
              onClick={handleButtonOutlineClick}
              nameData={DETAIL_COMPROMISED_BOOKMARK}
            />

            <div className="mt-8 ">
              <div className="flex items-center relative">
                <div
                  className={clsx(
                    "absolute bottom-[-90px] left-0 z-30",
                    initialCheckboxState && checkboxArray.length > 0
                      ? "visible"
                      : "hidden"
                  )}
                >
                  <div className="bg-white px-[16px] py-[9px] rounded-lg shadow-xl">
                    {selectedButton !==
                      DETAIL_COMPROMISED_COMPROMISE_DEVICES && (
                      <div
                        className="flex items-center justify-between cursor-pointer hover:bg-[#FFEBD4] rounded-lg py-[4px]  px-[8px]"
                        onClick={handleValidatedAllCheckbox}
                      >
                        <h1 className="mr-6 text-Base-normal">
                          Marked as validated
                        </h1>
                        <RightOutlined />
                      </div>
                    )}
                    <div
                      className="flex items-center justify-between mt-2 cursor-pointer hover:bg-[#FFEBD4] rounded-lg py-[4px] px-[8px] "
                      onClick={handleBookmarkAllCheckboxes}
                    >
                      <h1 className="mr-6 text-Base-normal">
                        {" "}
                        {handleCheckBookmarkOrUnbookmarkText()}{" "}
                      </h1>
                      <RightOutlined />
                    </div>
                  </div>
                </div>
                <div className="border-[1px] border-[#D5D5D5] py-[6px] px-[8px] rounded-[8px]">
                  {handleDisableExportButton() !== null && (
                    <ConfigProvider
                      theme={{
                        token: {
                          colorPrimary: "#FF6F1E",
                        },
                        components: {
                          Popover: {
                            titleMinWidth: 30,
                            colorBgElevated: "#000000E0",
                            colorText: "#FFFFFF",
                            fontFamily: "inherit",
                            lineHeight: 1,
                            fontSize: 12,
                          },
                        },
                      }}
                    >
                      <Popover
                        content={"Check for Validated or Multiple Bookmark"}
                        placement="bottomLeft"
                      >
                        <Checkbox
                          onChange={handleInitialCheckboxState}
                          checked={initialCheckboxState}
                        >
                          Bookmark / Validated
                        </Checkbox>
                      </Popover>
                    </ConfigProvider>
                  )}
                </div>
                <div
                  className={clsx(
                    "flex ml-auto",
                    initialCheckboxState ? "visible" : "hidden"
                  )}
                >
                  <button
                    className={clsx(
                      "py-[5px] px-[16px] rounded-md text-primary-base bg-white border-[1px] border-[#D5D5D5] flex"
                    )}
                  >
                    <BookmarkBorderIcon />
                    <p className="ml-3">Bookmark all</p>
                  </button>
                  <button
                    className={clsx(
                      "ml-4 py-[5px] px-[16px] rounded-md bg-primary-base text-white text-Base-normal"
                    )}
                  >
                    Validate all
                  </button>
                </div>
                <div
                  className={clsx(
                    "ml-4 bg-input-container border-input-border flex items-center justify-between border-t-2 border-b-2 border-r-2 rounded-lg w-[400px]",
                    initialCheckboxState ? "hidden" : "visible"
                  )}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <input
                    type="email"
                    className={clsx(
                      " bg-transparent  py-1.5 px-3  border-r-2  text-Base-normal w-full  "
                      // handleDisableExportButton() === null &&
                      //   "cursor-not-allowed"
                      // getCookie("user_status") === "true" &&
                      //   "cursor-not-allowed"
                    )}
                    placeholder={
                      selectedButton === DETAIL_COMPROMISED_COMPROMISE_DEVICES
                        ? "Search by Devices name/IP address"
                        : "Search by URL/Login"
                    }
                    onChange={handleSearchKeyword}
                    value={inputSearch}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleClickSearch();
                      }
                    }}
                    // disabled={handleDisableExportButton() === null}
                    // readOnly={handleDisableExportButton() === null}
                    // disabled={getCookie("user_status") === "true"}
                    // readOnly={getCookie("user_status") === "true"}
                  />
                  <div
                    className="px-3 cursor-pointer"
                    onClick={handleClickSearch}
                  >
                    <Image
                      src={"/images/sector_image_search.svg"}
                      alt="search icon"
                      width={16}
                      height={16}
                    />
                  </div>
                </div>
                {/* <Tooltip isActive={isHovered} right={"30px"} bottom={"30px"} /> */}
                <div
                  className={clsx(initialCheckboxState ? "hidden" : "visible")}
                >
                  <ConfigProvider
                    theme={{
                      token: {
                        colorBgContainer: "#F7F7F7",
                        colorBorder: "#D5D5D5",
                        colorText: "#000000E0",
                        fontWeightStrong: true,
                        colorPrimary: "#FF6F1E",
                      },
                      components: {
                        DatePicker: {
                          cellHeight: 20,
                          cellWidth: 32,
                          hoverBorderColor: "#FF6F1E",
                          cellActiveWithRangeBg: "#FFEBD4",
                          cellRangeBorderColor: "#FFD3A8",
                          activeBorderColor: "#FFEBD4",
                        },
                      },
                    }}
                  >
                    <RangePicker
                      onChange={handleRangePicker}
                      className="ml-8"
                      size="large"
                      // disabled={handleDisableExportButton() === null}
                      // readOnly={handleDisableExportButton() === null}
                      // disabled={getCookie("user_status") === "true"}
                      // readOnly={getCookie("user_status") === "true"}
                      onMouseEnter={handleMouseEnterRangeDate}
                      onMouseLeave={handleMouseLeaveRangeDate}
                      value={[
                        startDate ? dayjs(startDate) : "",
                        endDate ? dayjs(endDate) : "",
                      ]}
                    />
                  </ConfigProvider>
                  {/* <Tooltip
                    isActive={isHoveredRangeDate}
                    right={"0"}
                    bottom={"50px"}
                  /> */}
                </div>
                <div
                  className={clsx(
                    "ml-auto ",
                    initialCheckboxState ? "hidden" : "visible"
                  )}
                >
                  {checkIsBookmarkSection() === "no-bookmark" ? (
                    <ExportButton
                      onClick={handleExportToCSV}
                      disabled={handleDisableExportButton()}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </section>
          {
            // Todo
          }
          {bookmarBannerState !== null ? (
            bookmarBannerState ? (
              <section className="mx-8 py-[8px] px-[16px] flex items-center bg-success-chart rounded-lg shadow-lg">
                <CheckCircleFilled style={{ color: "white" }} />
                <p className="text-white text-Base-normal ml-[8px] ">
                  {" "}
                  Successfully added to bookmarks
                </p>
              </section>
            ) : (
              <section className="mx-8 py-[8px] px-[16px] flex items-center bg-error rounded-lg shadow-lg">
                <p className="text-white text-Base-normal ml-[8px] ">
                  {" "}
                  Oops something wrong when Bookmark data
                </p>
              </section>
            )
          ) : (
            ""
          )}
          {bannerStateMultipleBookmark !== null ? (
            bannerStateMultipleBookmark ? (
              <section className="mx-8 py-[8px] px-[16px] flex items-center bg-success-chart rounded-lg shadow-lg">
                <CheckCircleFilled style={{ color: "white" }} />
                <p className="text-white text-Base-normal ml-[8px] ">
                  {" "}
                  Successfully added multiple data to bookmarks
                </p>
              </section>
            ) : (
              <section className="mx-8 py-[8px] px-[16px] flex items-center bg-error rounded-lg shadow-lg">
                <p className="text-white text-Base-normal ml-[8px] ">
                  {" "}
                  Oops something wrong when Bookmark multiple data
                </p>
              </section>
            )
          ) : (
            ""
          )}

          {bannerStateMultipleValidated !== null ? (
            bannerStateMultipleValidated ? (
              <section className="mx-8 py-[8px] px-[16px] flex items-center bg-success-chart rounded-lg shadow-lg">
                <CheckCircleFilled style={{ color: "white" }} />
                <p className="text-white text-Base-normal ml-[8px] ">
                  {" "}
                  Successfully Validated Data. Go to Validated Section to see
                  more
                </p>
              </section>
            ) : (
              <section className="mx-8 py-[8px] px-[16px] flex items-center bg-error rounded-lg shadow-lg">
                <p className="text-white text-Base-normal ml-[8px] ">
                  {" "}
                  Oops something wrong when Validated multiple data
                </p>
              </section>
            )
          ) : (
            ""
          )}
          {unbookmarBannerState !== null ? (
            unbookmarBannerState ? (
              <section className="mx-8 py-[8px] px-[16px] flex items-center bg-success-chart rounded-lg shadow-lg">
                <CheckCircleFilled style={{ color: "white" }} />
                <p className="text-white text-Base-normal ml-[8px] ">
                  {" "}
                  Successfully remove from bookmarks
                </p>
              </section>
            ) : (
              <section className="mx-8 py-[8px] px-[16px] flex items-center bg-error rounded-lg shadow-lg">
                <p className="text-white text-Base-normal ml-[8px] ">
                  {" "}
                  Oops something wrong when remove Bookmark data
                </p>
              </section>
            )
          ) : (
            ""
          )}
          {validasiSuccess !== null ? (
            validasiSuccess ? (
              <section className="mx-8 py-[8px] px-[16px] flex items-center bg-success-chart rounded-lg shadow-lg">
                <CheckCircleFilled style={{ color: "white" }} />
                <p className="text-white text-Base-normal ml-[8px] ">
                  {" "}
                  Successfully change Testing Status
                </p>
              </section>
            ) : (
              <section className="mx-8 py-[8px] px-[16px] flex items-center bg-error rounded-lg shadow-lg">
                <p className="text-white text-Base-normal ml-[8px] ">
                  {" "}
                  Oops something wrong when Change Testing Status data
                </p>
              </section>
            )
          ) : (
            ""
          )}
          <section className="p-8">
            {loadingCompromisedData ? (
              <div className="text-center">
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#FF6F1E",
                    },
                  }}
                >
                  <Spin size="large" />
                </ConfigProvider>
              </div>
            ) : (
              <>
                {selectedButton === DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE &&
                  selectedOutlineButton === DETAIL_COMPROMISED_DEFAULT &&
                  employeeData && (
                    <div className="border-2 rounded-xl border-input-border">
                      <table className="bg-white  w-full rounded-xl">
                        {/* Render employee data table */}
                        <thead>
                          {/* Table header */}
                          <tr className="border-b-[1px] border-[#D5D5D5] w-full">
                            <td className="py-[19px] px-[16px]  border-r-[1px] border-input-border border-dashed ">
                              No
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Date compromised
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              URL
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Login
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Password
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Password strength
                            </td>
                            <td className="py-[19px] px-[16px]">Action</td>
                          </tr>
                        </thead>
                        <tbody className="text-Base-normal text-text-description">
                          {employeeData.data.map((data, index) => (
                            <tr
                              className="border-b-[2px] border-[#D5D5D5]"
                              key={data.id}
                            >
                              {/* Render employee data row */}
                              <td className="py-[19px] px-[16px]">
                                {initialCheckboxState ? (
                                  <ConfigProvider
                                    theme={{
                                      token: {
                                        colorPrimary: "#FF6F1E",
                                      },
                                    }}
                                  >
                                    <Checkbox
                                      onChange={(e) =>
                                        handleGatheringIds(
                                          e,
                                          data.id,
                                          DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE
                                        )
                                      }
                                    ></Checkbox>
                                  </ConfigProvider>
                                ) : (
                                  index + 1
                                )}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {data.date}
                              </td>
                              <td
                                className="py-[19px] px-[16px] w-[100px] text-wrap"
                                style={{ width: "100px" }}
                              >
                                <p
                                  style={{
                                    maxWidth: "280px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  <a
                                    href={`${data.url}`}
                                    target="_blank"
                                    className="underline"
                                  >
                                    {data.url}
                                  </a>
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px] text-wrap w-[100px] whitespace-pre-line">
                                <p
                                  style={{
                                    maxWidth: "230px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  {data.login}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <p
                                  style={{
                                    maxWidth: "150px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  {data.pass}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <p
                                  className={clsx(
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.pass
                                    ) === "Bad" && "text-error",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.pass
                                    ) === "Weak" && "text-pink",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.pass
                                    ) === "Medium" && "text-text-orange",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.pass
                                    ) === "Good" && "text-blue-600",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.pass
                                    ) === "Strong" && "text-text-green"
                                  )}
                                >
                                  {CalculatePasswordStrengthWithReturnPlainString(
                                    data.pass
                                  )}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {data.action}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/* Render pagination */}
                      <div className="flex items-center justify-between my-[19px] mx-[16px]">
                        <p className="text-Base-normal text-[#676767] ">
                          Showing {employeeData.size} to {employeeData.count}{" "}
                          entries
                        </p>
                        <div>
                          <ConfigProvider
                            theme={{
                              components: {
                                Pagination: {
                                  itemActiveBg: "#FF6F1E",
                                  itemLinkBg: "#fff",
                                  itemInputBg: "#fff",
                                },
                              },
                              token: {
                                colorPrimary: "white",
                              },
                            }}
                          >
                            <Pagination
                              type="primary"
                              defaultCurrent={1}
                              total={employeeData.count}
                              showSizeChanger={false}
                              style={{ color: "#FF6F1E" }}
                              hideOnSinglePage={true}
                              onChange={handlePage}
                              current={page}
                            />
                          </ConfigProvider>
                        </div>
                      </div>
                    </div>
                  )}

                {selectedButton === DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE &&
                  selectedOutlineButton === DETAIL_COMPROMISED_DEFAULT &&
                  employeeData === null && (
                    <div className="text-center flex flex-col justify-center items-center">
                      <div>
                        <Image
                          src={"/images/no_result_found_compromised.svg"}
                          alt="search icon"
                          width={129}
                          height={121}
                        />
                      </div>
                      <div className="mt-5">
                        <h1 className="text-heading-3">No results found</h1>
                        <p className="text-text-description text-LG-normal mt-4">
                          Nothing was found after the scan.
                        </p>
                      </div>
                    </div>
                  )}

                {selectedButton === DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE &&
                  selectedOutlineButton === DETAIL_COMPROMISED_TESTING &&
                  employeeValidatedData && (
                    <div className="border-2 rounded-xl border-input-border">
                      <table className="bg-white  w-full rounded-xl">
                        {/* Render employee data table */}
                        <thead>
                          {/* Table header */}
                          <tr className="border-b-[1px] border-[#D5D5D5] w-full">
                            <td className="py-[19px] px-[16px]  border-r-[1px] border-input-border border-dashed ">
                              No
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Date compromised
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              URL
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Login
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Password
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Password strength
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Status
                            </td>
                            <td className="py-[19px] px-[16px]">Action</td>
                          </tr>
                        </thead>
                        <tbody className="text-Base-normal text-text-description">
                          {employeeValidatedData.data.map((data, index) => (
                            <tr
                              className="border-b-[2px] border-[#D5D5D5]"
                              key={data.id}
                            >
                              {/* Render employee data row */}
                              <td className="py-[19px] px-[16px]">
                                {initialCheckboxState ? (
                                  <ConfigProvider
                                    theme={{
                                      token: {
                                        colorPrimary: "#FF6F1E",
                                      },
                                    }}
                                  >
                                    <Checkbox
                                      onChange={(e) =>
                                        handleGatheringIds(
                                          e,
                                          data.id,
                                          DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE
                                        )
                                      }
                                    ></Checkbox>
                                  </ConfigProvider>
                                ) : (
                                  index + 1
                                )}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {convertDateFormat(data.datetime_added)}
                              </td>
                              <td className="py-[19px] px-[16px] w-[100px] text-wrap">
                                <p
                                  style={{
                                    maxWidth: "200px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  <a
                                    href={`${data.url}`}
                                    target="_blank"
                                    className="underline"
                                  >
                                    {data.url}
                                  </a>
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px] text-wrap w-[100px] whitespace-pre-line">
                                <p
                                  style={{
                                    maxWidth: "170px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  {data.login}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <p
                                  style={{
                                    maxWidth: "140px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  {data.password}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <p
                                  className={clsx(
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Bad" && "text-error",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Weak" && "text-pink",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Medium" && "text-text-orange",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Good" && "text-blue-600",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Strong" && "text-text-green"
                                  )}
                                >
                                  {CalculatePasswordStrengthWithReturnPlainString(
                                    data.password
                                  )}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <ConfigProvider
                                  theme={{
                                    token: {
                                      colorBgContainer: `${
                                        data.status_validasi === "invalid"
                                          ? "#F7F7F7"
                                          : "white"
                                      }`,
                                      colorBorder: `${
                                        data.status_validasi === "invalid"
                                          ? "#D5D5D5"
                                          : "#52C41A"
                                      }`,
                                      colorText: `${
                                        data.status_validasi === "invalid"
                                          ? "#000000E0"
                                          : "#52C41A"
                                      }`,
                                      fontWeightStrong: true,
                                    },
                                    components: {
                                      Select: {
                                        optionActiveBg: "#F7F7F7",
                                        optionSelectedBg: "#FFEBD4",
                                      },
                                    },
                                  }}
                                >
                                  <Select
                                    defaultValue={data.status_validasi}
                                    value={data.status_validasi}
                                    style={{ width: 91 }}
                                    onChange={(value) =>
                                      handleSelectValidation(
                                        value,
                                        data.id,
                                        DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE
                                      )
                                    }
                                    options={[
                                      {
                                        value: "invalid",
                                        label: "Invalid",
                                      },

                                      {
                                        value: "valid",
                                        label: "Valid",
                                      },
                                    ]}
                                  />
                                </ConfigProvider>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <div className="flex">
                                  <div
                                    className="cursor-pointer"
                                    onClick={() =>
                                      handleDetails(
                                        data,
                                        DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE,
                                        DETAIL_COMPROMISED_TESTING
                                      )
                                    }
                                  >
                                    <EyeOutlined style={{ fontSize: "18px" }} />
                                  </div>
                                  <div
                                    className="ml-auto mr-auto cursor-pointer"
                                    onClick={() =>
                                      handleBookmarkConfirm(
                                        data.id,
                                        DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE
                                      )
                                    }
                                  >
                                    {data.is_boomark ? (
                                      <BookFilled
                                        style={{
                                          fontSize: "18px",
                                          color: "#FFD591",
                                        }}
                                      />
                                    ) : (
                                      <BookOutlined
                                        style={{ fontSize: "18px" }}
                                      />
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/* Render pagination */}
                      <div className="flex items-center justify-between my-[19px] mx-[16px]">
                        <p className="text-Base-normal text-[#676767] ">
                          Showing {employeeValidatedData.size} to{" "}
                          {employeeValidatedData.count} entries
                        </p>
                        <div>
                          <ConfigProvider
                            theme={{
                              components: {
                                Pagination: {
                                  itemActiveBg: "#FF6F1E",
                                  itemLinkBg: "#fff",
                                  itemInputBg: "#fff",
                                },
                              },
                              token: {
                                colorPrimary: "white",
                              },
                            }}
                          >
                            <Pagination
                              type="primary"
                              defaultCurrent={1}
                              total={employeeValidatedData.count}
                              showSizeChanger={false}
                              style={{ color: "#FF6F1E" }}
                              hideOnSinglePage={true}
                              onChange={handlepageEmployeeValidate}
                              current={pageEmployeeValidate}
                            />
                          </ConfigProvider>
                        </div>
                      </div>
                    </div>
                  )}

                {selectedButton === DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE &&
                  selectedOutlineButton === DETAIL_COMPROMISED_TESTING &&
                  employeeValidatedData === null && (
                    <div className="text-center flex flex-col justify-center items-center">
                      <div>
                        <Image
                          src={"/images/no_result_found_compromised.svg"}
                          alt="search icon"
                          width={129}
                          height={121}
                        />
                      </div>
                      <div className="mt-5">
                        <h1 className="text-heading-3">No results found</h1>
                        <p className="text-text-description text-LG-normal mt-4">
                          Nothing was found after the scan.
                        </p>
                      </div>
                    </div>
                  )}

                {selectedButton === DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE &&
                  selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK &&
                  employeeBookmarkData && (
                    <div className="border-2 rounded-xl border-input-border">
                      <table className="bg-white  w-full rounded-xl">
                        {/* Render employee data table */}
                        <thead>
                          {/* Table header */}
                          <tr className="border-b-[1px] border-[#D5D5D5] w-full">
                            <td className="py-[19px] px-[16px]  border-r-[1px] border-input-border border-dashed ">
                              No
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Date compromised
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              URL
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Login
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Password
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Password strength
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Status
                            </td>
                            <td className="py-[19px] px-[16px]">Action</td>
                          </tr>
                        </thead>
                        <tbody className="text-Base-normal text-text-description">
                          {employeeBookmarkData.data.map((data, index) => (
                            <tr
                              className="border-b-[2px] border-[#D5D5D5]"
                              key={data.id}
                            >
                              {/* Render employee data row */}
                              <td className="py-[19px] px-[16px]">
                                {initialCheckboxState ? (
                                  <ConfigProvider
                                    theme={{
                                      token: {
                                        colorPrimary: "#FF6F1E",
                                      },
                                    }}
                                  >
                                    <Checkbox
                                      onChange={(e) =>
                                        handleGatheringIds(
                                          e,
                                          data.id,
                                          DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE
                                        )
                                      }
                                    ></Checkbox>
                                  </ConfigProvider>
                                ) : (
                                  index + 1
                                )}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {convertDateFormat(data.datetime_added)}
                              </td>
                              <td className="py-[19px] px-[16px] w-[100px] text-wrap">
                                <p
                                  style={{
                                    maxWidth: "200px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  <a
                                    href={`${data.url}`}
                                    target="_blank"
                                    className="underline"
                                  >
                                    {data.url}
                                  </a>
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px] text-wrap w-[100px] whitespace-pre-line">
                                <p
                                  style={{
                                    maxWidth: "170px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  {data.login}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <p
                                  style={{
                                    maxWidth: "140px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  {data.password}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <p
                                  className={clsx(
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Bad" && "text-error",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Weak" && "text-pink",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Medium" && "text-text-orange",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Good" && "text-blue-600",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Strong" && "text-text-green"
                                  )}
                                >
                                  {CalculatePasswordStrengthWithReturnPlainString(
                                    data.password
                                  )}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {data.status_validasi !== "-" && (
                                  <ConfigProvider
                                    theme={{
                                      token: {
                                        colorBgContainer: `${
                                          data.status_validasi === "invalid"
                                            ? "#F7F7F7"
                                            : "white"
                                        }`,
                                        colorBorder: `${
                                          data.status_validasi === "invalid"
                                            ? "#D5D5D5"
                                            : "#52C41A"
                                        }`,
                                        colorText: `${
                                          data.status_validasi === "invalid"
                                            ? "#000000E0"
                                            : "#52C41A"
                                        }`,
                                        fontWeightStrong: true,
                                      },
                                      components: {
                                        Select: {
                                          optionActiveBg: "#F7F7F7",
                                          optionSelectedBg: "#FFEBD4",
                                        },
                                      },
                                    }}
                                  >
                                    <Select
                                      defaultValue={data.status_validasi}
                                      value={data.status_validasi}
                                      style={{ width: 91 }}
                                      disabled={true}
                                      onChange={(value) =>
                                        handleSelectValidation(
                                          value,
                                          data.id,
                                          DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE
                                        )
                                      }
                                      options={[
                                        {
                                          value: "invalid",
                                          label: "Invalid",
                                        },

                                        {
                                          value: "valid",
                                          label: "Valid",
                                        },
                                      ]}
                                    />
                                  </ConfigProvider>
                                )}
                                {data.status_validasi === "-" && (
                                  <p> {data.status_validasi} </p>
                                )}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <div className="flex">
                                  <div
                                    className="cursor-pointer"
                                    onClick={() =>
                                      handleDetails(
                                        data,
                                        DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE,
                                        DETAIL_COMPROMISED_BOOKMARK
                                      )
                                    }
                                  >
                                    <EyeOutlined style={{ fontSize: "18px" }} />
                                  </div>
                                  <div
                                    className="ml-auto mr-auto cursor-pointer"
                                    onClick={() =>
                                      handleUnBookmarkConfirm(
                                        data.id,
                                        DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE
                                      )
                                    }
                                  >
                                    <BookFilled
                                      style={{
                                        fontSize: "18px",
                                        color: "#FFD591",
                                      }}
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/* Render pagination */}
                      <div className="flex items-center justify-between my-[19px] mx-[16px]">
                        <p className="text-Base-normal text-[#676767] ">
                          Showing {employeeBookmarkData.size} to{" "}
                          {employeeBookmarkData.count} entries
                        </p>
                        <div>
                          <ConfigProvider
                            theme={{
                              components: {
                                Pagination: {
                                  itemActiveBg: "#FF6F1E",
                                  itemLinkBg: "#fff",
                                  itemInputBg: "#fff",
                                },
                              },
                              token: {
                                colorPrimary: "white",
                              },
                            }}
                          >
                            <Pagination
                              type="primary"
                              defaultCurrent={1}
                              total={employeeBookmarkData.count}
                              showSizeChanger={false}
                              style={{ color: "#FF6F1E" }}
                              hideOnSinglePage={true}
                              onChange={handlepageEmployeeBookmark}
                              current={pageEmployeeBookmark}
                            />
                          </ConfigProvider>
                        </div>
                      </div>
                    </div>
                  )}

                {selectedButton === DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE &&
                  selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK &&
                  employeeBookmarkData === null && (
                    <div className="text-center flex flex-col justify-center items-center">
                      <div>
                        <Image
                          src={"/images/no_result_found_compromised.svg"}
                          alt="search icon"
                          width={129}
                          height={121}
                        />
                      </div>
                      <div className="mt-5">
                        <h1 className="text-heading-3">No results found</h1>
                        <p className="text-text-description text-LG-normal mt-4">
                          Nothing was found after the scan.
                        </p>
                      </div>
                    </div>
                  )}

                {selectedButton === DETAIL_COMPROMISED_COMPROMISE_USERS &&
                  selectedOutlineButton === DETAIL_COMPROMISED_DEFAULT &&
                  usersData && (
                    <div className="border-2 rounded-xl border-input-border">
                      <table className="bg-white  w-full rounded-xl">
                        {/* Render employee data table */}
                        <thead>
                          {/* Table header */}
                          <tr className="border-b-[1px] border-[#D5D5D5] w-full">
                            <td className="py-[19px] px-[16px]  border-r-[1px] border-input-border border-dashed ">
                              No
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Date compromised
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              URL
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Login
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Password
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Password strength
                            </td>
                            <td className="py-[19px] px-[16px]">Action</td>
                          </tr>
                        </thead>
                        <tbody className="text-Base-normal text-text-description">
                          {usersData.data.map((data, index) => (
                            <tr
                              className="border-b-[2px] border-[#D5D5D5]"
                              key={data.id}
                            >
                              {/* Render employee data row */}
                              <td className="py-[19px] px-[16px]">
                                {initialCheckboxState ? (
                                  <ConfigProvider
                                    theme={{
                                      token: {
                                        colorPrimary: "#FF6F1E",
                                      },
                                    }}
                                  >
                                    <Checkbox
                                      onChange={(e) =>
                                        handleGatheringIds(
                                          e,
                                          data.id,
                                          DETAIL_COMPROMISED_COMPROMISE_USERS
                                        )
                                      }
                                    ></Checkbox>
                                  </ConfigProvider>
                                ) : (
                                  index + 1
                                )}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {data.date}
                              </td>
                              <td className="py-[19px] px-[16px] w-[100px] text-wrap">
                                <p
                                  style={{
                                    maxWidth: "280px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  <a
                                    href={`${data.url}`}
                                    target="_blank"
                                    className="underline"
                                  >
                                    {data.url}
                                  </a>
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px] text-wrap w-[100px] whitespace-pre-line">
                                <p
                                  style={{
                                    maxWidth: "230px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  {data.login}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <p
                                  style={{
                                    maxWidth: "150px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  {data.pass}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <p
                                  className={clsx(
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.pass
                                    ) === "Bad" && "text-error",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.pass
                                    ) === "Weak" && "text-pink",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.pass
                                    ) === "Medium" && "text-text-orange",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.pass
                                    ) === "Good" && "text-blue-600",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.pass
                                    ) === "Strong" && "text-text-green"
                                  )}
                                >
                                  {CalculatePasswordStrengthWithReturnPlainString(
                                    data.pass
                                  )}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {data.action}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/* Render pagination */}
                      <div className="flex items-center justify-between my-[19px] mx-[16px]">
                        <p className="text-Base-normal text-[#676767] ">
                          Showing {usersData.size} to {usersData.count} entries
                        </p>
                        <div>
                          <ConfigProvider
                            theme={{
                              components: {
                                Pagination: {
                                  itemActiveBg: "#FF6F1E",
                                  itemLinkBg: "#fff",
                                  itemInputBg: "#fff",
                                },
                              },
                              token: {
                                colorPrimary: "white",
                              },
                            }}
                          >
                            <Pagination
                              type="primary"
                              defaultCurrent={1}
                              total={usersData.count}
                              showSizeChanger={false}
                              style={{ color: "#FF6F1E" }}
                              hideOnSinglePage={true}
                              onChange={handlepageusers}
                              current={pageUsers}
                            />
                          </ConfigProvider>
                        </div>
                      </div>
                    </div>
                  )}
                {selectedButton === DETAIL_COMPROMISED_COMPROMISE_USERS &&
                  selectedOutlineButton === DETAIL_COMPROMISED_DEFAULT &&
                  usersData === null && (
                    <div className="text-center flex flex-col justify-center items-center">
                      <div>
                        <Image
                          src={"/images/no_result_found_compromised.svg"}
                          alt="search icon"
                          width={129}
                          height={121}
                        />
                      </div>
                      <div className="mt-5">
                        <h1 className="text-heading-3">No results found</h1>
                        <p className="text-text-description text-LG-normal mt-4">
                          Nothing was found after the scan.
                        </p>
                      </div>
                    </div>
                  )}

                {selectedButton === DETAIL_COMPROMISED_COMPROMISE_USERS &&
                  selectedOutlineButton === DETAIL_COMPROMISED_TESTING &&
                  usersValidatedData && (
                    <div className="border-2 rounded-xl border-input-border">
                      <table className="bg-white  w-full rounded-xl">
                        {/* Render employee data table */}
                        <thead>
                          {/* Table header */}
                          <tr className="border-b-[1px] border-[#D5D5D5] w-full">
                            <td className="py-[19px] px-[16px]  border-r-[1px] border-input-border border-dashed ">
                              No
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Date compromised
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              URL
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Login
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Password
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Password strength
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Status
                            </td>
                            <td className="py-[19px] px-[16px]">Action</td>
                          </tr>
                        </thead>
                        <tbody className="text-Base-normal text-text-description">
                          {usersValidatedData.data.map((data, index) => (
                            <tr
                              className="border-b-[2px] border-[#D5D5D5]"
                              key={data.id}
                            >
                              {/* Render employee data row */}
                              <td className="py-[19px] px-[16px]">
                                {initialCheckboxState ? (
                                  <ConfigProvider
                                    theme={{
                                      token: {
                                        colorPrimary: "#FF6F1E",
                                      },
                                    }}
                                  >
                                    <Checkbox
                                      onChange={(e) =>
                                        handleGatheringIds(
                                          e,
                                          data.id,
                                          DETAIL_COMPROMISED_COMPROMISE_USERS
                                        )
                                      }
                                    ></Checkbox>
                                  </ConfigProvider>
                                ) : (
                                  index + 1
                                )}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {convertDateFormat(data.datetime_added)}
                              </td>
                              <td className="py-[19px] px-[16px] w-[100px] text-wrap">
                                <p
                                  style={{
                                    maxWidth: "200px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  <a
                                    href={`${data.url}`}
                                    target="_blank"
                                    className="underline"
                                  >
                                    {data.url}
                                  </a>
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px] text-wrap w-[100px] whitespace-pre-line">
                                <p
                                  style={{
                                    maxWidth: "170px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  {data.login}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <p
                                  style={{
                                    maxWidth: "140px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  {data.password}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <p
                                  className={clsx(
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Bad" && "text-error",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Weak" && "text-pink",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Medium" && "text-text-orange",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Good" && "text-blue-600",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Strong" && "text-text-green"
                                  )}
                                >
                                  {CalculatePasswordStrengthWithReturnPlainString(
                                    data.password
                                  )}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <ConfigProvider
                                  theme={{
                                    token: {
                                      colorBgContainer: `${
                                        data.status_validasi === "invalid"
                                          ? "#F7F7F7"
                                          : "white"
                                      }`,
                                      colorBorder: `${
                                        data.status_validasi === "invalid"
                                          ? "#D5D5D5"
                                          : "#52C41A"
                                      }`,
                                      colorText: `${
                                        data.status_validasi === "invalid"
                                          ? "#000000E0"
                                          : "#52C41A"
                                      }`,
                                      fontWeightStrong: true,
                                    },
                                    components: {
                                      Select: {
                                        optionActiveBg: "#F7F7F7",
                                        optionSelectedBg: "#FFEBD4",
                                      },
                                    },
                                  }}
                                >
                                  <Select
                                    defaultValue={data.status_validasi}
                                    value={data.status_validasi}
                                    style={{ width: 91 }}
                                    onChange={(value) =>
                                      handleSelectValidation(
                                        value,
                                        data.id,
                                        DETAIL_COMPROMISED_COMPROMISE_USERS
                                      )
                                    }
                                    options={[
                                      {
                                        value: "invalid",
                                        label: "Invalid",
                                      },

                                      {
                                        value: "valid",
                                        label: "Valid",
                                      },
                                    ]}
                                  />
                                </ConfigProvider>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <div className="flex">
                                  <div
                                    className="cursor-pointer"
                                    onClick={() =>
                                      handleDetails(
                                        data,
                                        DETAIL_COMPROMISED_COMPROMISE_USERS,
                                        DETAIL_COMPROMISED_TESTING
                                      )
                                    }
                                  >
                                    <EyeOutlined style={{ fontSize: "18px" }} />
                                  </div>
                                  <div
                                    className="ml-auto mr-auto cursor-pointer"
                                    onClick={() =>
                                      handleBookmarkConfirm(
                                        data.id,
                                        DETAIL_COMPROMISED_COMPROMISE_USERS
                                      )
                                    }
                                  >
                                    {data.is_boomark ? (
                                      <BookFilled
                                        style={{
                                          fontSize: "18px",
                                          color: "#FFD591",
                                        }}
                                      />
                                    ) : (
                                      <BookOutlined
                                        style={{ fontSize: "18px" }}
                                      />
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/* Render pagination */}
                      <div className="flex items-center justify-between my-[19px] mx-[16px]">
                        <p className="text-Base-normal text-[#676767] ">
                          Showing {usersValidatedData.size} to{" "}
                          {usersValidatedData.count} entries
                        </p>
                        <div>
                          <ConfigProvider
                            theme={{
                              components: {
                                Pagination: {
                                  itemActiveBg: "#FF6F1E",
                                  itemLinkBg: "#fff",
                                  itemInputBg: "#fff",
                                },
                              },
                              token: {
                                colorPrimary: "white",
                              },
                            }}
                          >
                            <Pagination
                              type="primary"
                              defaultCurrent={1}
                              total={usersValidatedData.count}
                              showSizeChanger={false}
                              style={{ color: "#FF6F1E" }}
                              hideOnSinglePage={true}
                              onChange={handlesetPageUsersValidate}
                              current={pageUsersValidate}
                            />
                          </ConfigProvider>
                        </div>
                      </div>
                    </div>
                  )}

                {selectedButton === DETAIL_COMPROMISED_COMPROMISE_USERS &&
                  selectedOutlineButton === DETAIL_COMPROMISED_TESTING &&
                  usersValidatedData === null && (
                    <div className="text-center flex flex-col justify-center items-center">
                      <div>
                        <Image
                          src={"/images/no_result_found_compromised.svg"}
                          alt="search icon"
                          width={129}
                          height={121}
                        />
                      </div>
                      <div className="mt-5">
                        <h1 className="text-heading-3">No results found</h1>
                        <p className="text-text-description text-LG-normal mt-4">
                          Nothing was found after the scan.
                        </p>
                      </div>
                    </div>
                  )}

                {selectedButton === DETAIL_COMPROMISED_COMPROMISE_USERS &&
                  selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK &&
                  usersBookmarkData && (
                    <div className="border-2 rounded-xl border-input-border">
                      <table className="bg-white  w-full rounded-xl">
                        {/* Render employee data table */}
                        <thead>
                          {/* Table header */}
                          <tr className="border-b-[1px] border-[#D5D5D5] w-full">
                            <td className="py-[19px] px-[16px]  border-r-[1px] border-input-border border-dashed ">
                              No
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Date compromised
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              URL
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Login
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Password
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Password strength
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Status
                            </td>
                            <td className="py-[19px] px-[16px]">Action</td>
                          </tr>
                        </thead>
                        <tbody className="text-Base-normal text-text-description">
                          {usersBookmarkData.data.map((data, index) => (
                            <tr
                              className="border-b-[2px] border-[#D5D5D5]"
                              key={data.id}
                            >
                              {/* Render employee data row */}
                              <td className="py-[19px] px-[16px]">
                                {initialCheckboxState ? (
                                  <ConfigProvider
                                    theme={{
                                      token: {
                                        colorPrimary: "#FF6F1E",
                                      },
                                    }}
                                  >
                                    <Checkbox
                                      onChange={(e) =>
                                        handleGatheringIds(
                                          e,
                                          data.id,
                                          DETAIL_COMPROMISED_COMPROMISE_USERS
                                        )
                                      }
                                    ></Checkbox>
                                  </ConfigProvider>
                                ) : (
                                  index + 1
                                )}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {convertDateFormat(data.datetime_added)}
                              </td>
                              <td className="py-[19px] px-[16px] w-[100px] text-wrap">
                                <p
                                  style={{
                                    maxWidth: "200px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  <a
                                    href={`${data.url}`}
                                    target="_blank"
                                    className="underline"
                                  >
                                    {data.url}
                                  </a>
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px] text-wrap w-[100px] whitespace-pre-line">
                                <p
                                  style={{
                                    maxWidth: "170px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  {data.login}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <p
                                  style={{
                                    maxWidth: "140px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  {data.password}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <p
                                  className={clsx(
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Bad" && "text-error",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Weak" && "text-pink",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Medium" && "text-text-orange",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Good" && "text-blue-600",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Strong" && "text-text-green"
                                  )}
                                >
                                  {CalculatePasswordStrengthWithReturnPlainString(
                                    data.password
                                  )}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {data.status_validasi !== "-" && (
                                  <ConfigProvider
                                    theme={{
                                      token: {
                                        colorBgContainer: `${
                                          data.status_validasi === "invalid"
                                            ? "#F7F7F7"
                                            : "white"
                                        }`,
                                        colorBorder: `${
                                          data.status_validasi === "invalid"
                                            ? "#D5D5D5"
                                            : "#52C41A"
                                        }`,
                                        colorText: `${
                                          data.status_validasi === "invalid"
                                            ? "#000000E0"
                                            : "#52C41A"
                                        }`,
                                        fontWeightStrong: true,
                                      },
                                      components: {
                                        Select: {
                                          optionActiveBg: "#F7F7F7",
                                          optionSelectedBg: "#FFEBD4",
                                        },
                                      },
                                    }}
                                  >
                                    <Select
                                      defaultValue={data.status_validasi}
                                      value={data.status_validasi}
                                      style={{ width: 91 }}
                                      disabled={true}
                                      onChange={(value) =>
                                        handleSelectValidation(
                                          value,
                                          data.id,
                                          DETAIL_COMPROMISED_COMPROMISE_USERS
                                        )
                                      }
                                      options={[
                                        {
                                          value: "invalid",
                                          label: "Invalid",
                                        },

                                        {
                                          value: "valid",
                                          label: "Valid",
                                        },
                                      ]}
                                    />
                                  </ConfigProvider>
                                )}
                                {data.status_validasi === "-" && (
                                  <p> {data.status_validasi} </p>
                                )}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <div className="flex">
                                  <div
                                    className="cursor-pointer"
                                    onClick={() =>
                                      handleDetails(
                                        data,
                                        DETAIL_COMPROMISED_COMPROMISE_USERS,
                                        DETAIL_COMPROMISED_BOOKMARK
                                      )
                                    }
                                  >
                                    <EyeOutlined style={{ fontSize: "18px" }} />
                                  </div>
                                  <div
                                    className="ml-auto mr-auto cursor-pointer"
                                    onClick={() =>
                                      handleUnBookmarkConfirm(
                                        data.id,
                                        DETAIL_COMPROMISED_COMPROMISE_USERS
                                      )
                                    }
                                  >
                                    <BookFilled
                                      style={{
                                        fontSize: "18px",
                                        color: "#FFD591",
                                      }}
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/* Render pagination */}
                      <div className="flex items-center justify-between my-[19px] mx-[16px]">
                        <p className="text-Base-normal text-[#676767] ">
                          Showing {usersBookmarkData.size} to{" "}
                          {usersBookmarkData.count} entries
                        </p>
                        <div>
                          <ConfigProvider
                            theme={{
                              components: {
                                Pagination: {
                                  itemActiveBg: "#FF6F1E",
                                  itemLinkBg: "#fff",
                                  itemInputBg: "#fff",
                                },
                              },
                              token: {
                                colorPrimary: "white",
                              },
                            }}
                          >
                            <Pagination
                              type="primary"
                              defaultCurrent={1}
                              total={usersBookmarkData.count}
                              showSizeChanger={false}
                              style={{ color: "#FF6F1E" }}
                              hideOnSinglePage={true}
                              onChange={handlesetPageUserBookmark}
                              current={pageUsersBookmark}
                            />
                          </ConfigProvider>
                        </div>
                      </div>
                    </div>
                  )}

                {selectedButton === DETAIL_COMPROMISED_COMPROMISE_USERS &&
                  selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK &&
                  usersBookmarkData === null && (
                    <div className="text-center flex flex-col justify-center items-center">
                      <div>
                        <Image
                          src={"/images/no_result_found_compromised.svg"}
                          alt="search icon"
                          width={129}
                          height={121}
                        />
                      </div>
                      <div className="mt-5">
                        <h1 className="text-heading-3">No results found</h1>
                        <p className="text-text-description text-LG-normal mt-4">
                          Nothing was found after the scan.
                        </p>
                      </div>
                    </div>
                  )}
                {selectedButton === DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY &&
                  selectedOutlineButton === DETAIL_COMPROMISED_DEFAULT &&
                  thirdPartyData && (
                    <div className="border-2 rounded-xl border-input-border">
                      <table className="bg-white  w-full rounded-xl">
                        {/* Render employee data table */}
                        <thead>
                          {/* Table header */}
                          <tr className="border-b-[1px] border-[#D5D5D5] w-full">
                            <td className="py-[19px] px-[16px]  border-r-[1px] border-input-border border-dashed ">
                              No
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Date compromised
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              URL
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Login
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Password
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Password strength
                            </td>
                            <td className="py-[19px] px-[16px]">Action</td>
                          </tr>
                        </thead>
                        <tbody className="text-Base-normal text-text-description">
                          {thirdPartyData.data.map((data, index) => (
                            <tr
                              className="border-b-[2px] border-[#D5D5D5]"
                              key={data.id}
                            >
                              {/* Render employee data row */}
                              <td className="py-[19px] px-[16px]">
                                {initialCheckboxState ? (
                                  <ConfigProvider
                                    theme={{
                                      token: {
                                        colorPrimary: "#FF6F1E",
                                      },
                                    }}
                                  >
                                    <Checkbox
                                      onChange={(e) =>
                                        handleGatheringIds(
                                          e,
                                          data.id,
                                          DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY
                                        )
                                      }
                                    ></Checkbox>
                                  </ConfigProvider>
                                ) : (
                                  index + 1
                                )}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {data.date}
                              </td>
                              <td className="py-[19px] px-[16px] w-[100px] text-wrap">
                                <p
                                  style={{
                                    maxWidth: "280px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  <a
                                    href={`${data.url}`}
                                    target="_blank"
                                    className="underline"
                                  >
                                    {data.url}
                                  </a>
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px] text-wrap w-[100px] whitespace-pre-line">
                                <p
                                  style={{
                                    maxWidth: "230px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  {data.login}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <p
                                  style={{
                                    maxWidth: "150px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  {data.pass}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <p
                                  className={clsx(
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.pass
                                    ) === "Bad" && "text-error",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.pass
                                    ) === "Weak" && "text-pink",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.pass
                                    ) === "Medium" && "text-text-orange",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.pass
                                    ) === "Good" && "text-blue-600",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.pass
                                    ) === "Strong" && "text-text-green"
                                  )}
                                >
                                  {CalculatePasswordStrengthWithReturnPlainString(
                                    data.pass
                                  )}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {data.action}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/* Render pagination */}
                      <div className="flex items-center justify-between my-[19px] mx-[16px]">
                        <p className="text-Base-normal text-[#676767] ">
                          Showing {thirdPartyData.size} to{" "}
                          {thirdPartyData.count} entries
                        </p>
                        <div>
                          <ConfigProvider
                            theme={{
                              components: {
                                Pagination: {
                                  itemActiveBg: "#FF6F1E",
                                  itemLinkBg: "#fff",
                                  itemInputBg: "#fff",
                                },
                              },
                              token: {
                                colorPrimary: "white",
                              },
                            }}
                          >
                            <Pagination
                              type="primary"
                              defaultCurrent={1}
                              total={thirdPartyData.count}
                              showSizeChanger={false}
                              style={{ color: "#FF6F1E" }}
                              hideOnSinglePage={true}
                              onChange={handlesetPageThirdParty}
                              current={pageThirdParty}
                            />
                          </ConfigProvider>
                        </div>
                      </div>
                    </div>
                  )}
                {selectedButton === DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY &&
                  selectedOutlineButton === DETAIL_COMPROMISED_DEFAULT &&
                  thirdPartyData === null && (
                    <div className="text-center flex flex-col justify-center items-center">
                      <div>
                        <Image
                          src={"/images/no_result_found_compromised.svg"}
                          alt="search icon"
                          width={129}
                          height={121}
                        />
                      </div>
                      <div className="mt-5">
                        <h1 className="text-heading-3">No results found</h1>
                        <p className="text-text-description text-LG-normal mt-4">
                          Nothing was found after the scan.
                        </p>
                      </div>
                    </div>
                  )}

                {selectedButton === DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY &&
                  selectedOutlineButton === DETAIL_COMPROMISED_TESTING &&
                  thirdPartyValidatedData && (
                    <div className="border-2 rounded-xl border-input-border">
                      <table className="bg-white  w-full rounded-xl">
                        {/* Render employee data table */}
                        <thead>
                          {/* Table header */}
                          <tr className="border-b-[1px] border-[#D5D5D5] w-full">
                            <td className="py-[19px] px-[16px]  border-r-[1px] border-input-border border-dashed ">
                              No
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Date compromised
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              URL
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Login
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Password
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Password strength
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Status
                            </td>
                            <td className="py-[19px] px-[16px]">Action</td>
                          </tr>
                        </thead>
                        <tbody className="text-Base-normal text-text-description">
                          {thirdPartyValidatedData.data.map((data, index) => (
                            <tr
                              className="border-b-[2px] border-[#D5D5D5]"
                              key={data.id}
                            >
                              {/* Render employee data row */}
                              <td className="py-[19px] px-[16px]">
                                {initialCheckboxState ? (
                                  <ConfigProvider
                                    theme={{
                                      token: {
                                        colorPrimary: "#FF6F1E",
                                      },
                                    }}
                                  >
                                    <Checkbox
                                      onChange={(e) =>
                                        handleGatheringIds(
                                          e,
                                          data.id,
                                          DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY
                                        )
                                      }
                                    ></Checkbox>
                                  </ConfigProvider>
                                ) : (
                                  index + 1
                                )}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {convertDateFormat(data.datetime_added)}
                              </td>
                              <td className="py-[19px] px-[16px] w-[100px] text-wrap">
                                <p
                                  style={{
                                    maxWidth: "200px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  <a
                                    href={`${data.url}`}
                                    target="_blank"
                                    className="underline"
                                  >
                                    {data.url}
                                  </a>
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px] text-wrap w-[100px] whitespace-pre-line">
                                <p
                                  style={{
                                    maxWidth: "170px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  {data.login}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <p
                                  style={{
                                    maxWidth: "140px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  {data.password}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <p
                                  className={clsx(
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Bad" && "text-error",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Weak" && "text-pink",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Medium" && "text-text-orange",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Good" && "text-blue-600",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Strong" && "text-text-green"
                                  )}
                                >
                                  {CalculatePasswordStrengthWithReturnPlainString(
                                    data.password
                                  )}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <ConfigProvider
                                  theme={{
                                    token: {
                                      colorBgContainer: `${
                                        data.status_validasi === "invalid"
                                          ? "#F7F7F7"
                                          : "white"
                                      }`,
                                      colorBorder: `${
                                        data.status_validasi === "invalid"
                                          ? "#D5D5D5"
                                          : "#52C41A"
                                      }`,
                                      colorText: `${
                                        data.status_validasi === "invalid"
                                          ? "#000000E0"
                                          : "#52C41A"
                                      }`,
                                      fontWeightStrong: true,
                                    },
                                    components: {
                                      Select: {
                                        optionActiveBg: "#F7F7F7",
                                        optionSelectedBg: "#FFEBD4",
                                      },
                                    },
                                  }}
                                >
                                  <Select
                                    defaultValue={data.status_validasi}
                                    value={data.status_validasi}
                                    style={{ width: 91 }}
                                    onChange={(value) =>
                                      handleSelectValidation(
                                        value,
                                        data.id,
                                        DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY
                                      )
                                    }
                                    options={[
                                      {
                                        value: "invalid",
                                        label: "Invalid",
                                      },

                                      {
                                        value: "valid",
                                        label: "Valid",
                                      },
                                    ]}
                                  />
                                </ConfigProvider>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <div className="flex">
                                  <div
                                    className="cursor-pointer"
                                    onClick={() =>
                                      handleDetails(
                                        data,
                                        DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY,
                                        DETAIL_COMPROMISED_TESTING
                                      )
                                    }
                                  >
                                    <EyeOutlined style={{ fontSize: "18px" }} />
                                  </div>
                                  <div
                                    className="ml-auto mr-auto cursor-pointer"
                                    onClick={() =>
                                      handleBookmarkConfirm(
                                        data.id,
                                        DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY
                                      )
                                    }
                                  >
                                    {data.is_boomark ? (
                                      <BookFilled
                                        style={{
                                          fontSize: "18px",
                                          color: "#FFD591",
                                        }}
                                      />
                                    ) : (
                                      <BookOutlined
                                        style={{ fontSize: "18px" }}
                                      />
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/* Render pagination */}
                      <div className="flex items-center justify-between my-[19px] mx-[16px]">
                        <p className="text-Base-normal text-[#676767] ">
                          Showing {thirdPartyValidatedData.size} to{" "}
                          {thirdPartyValidatedData.count} entries
                        </p>
                        <div>
                          <ConfigProvider
                            theme={{
                              components: {
                                Pagination: {
                                  itemActiveBg: "#FF6F1E",
                                  itemLinkBg: "#fff",
                                  itemInputBg: "#fff",
                                },
                              },
                              token: {
                                colorPrimary: "white",
                              },
                            }}
                          >
                            <Pagination
                              type="primary"
                              defaultCurrent={1}
                              total={thirdPartyValidatedData.count}
                              showSizeChanger={false}
                              style={{ color: "#FF6F1E" }}
                              hideOnSinglePage={true}
                              onChange={handlesetPageThirdPartyValidate}
                              current={thirdPartyValidatedData}
                            />
                          </ConfigProvider>
                        </div>
                      </div>
                    </div>
                  )}

                {selectedButton === DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY &&
                  selectedOutlineButton === DETAIL_COMPROMISED_TESTING &&
                  thirdPartyValidatedData === null && (
                    <div className="text-center flex flex-col justify-center items-center">
                      <div>
                        <Image
                          src={"/images/no_result_found_compromised.svg"}
                          alt="search icon"
                          width={129}
                          height={121}
                        />
                      </div>
                      <div className="mt-5">
                        <h1 className="text-heading-3">No results found</h1>
                        <p className="text-text-description text-LG-normal mt-4">
                          Nothing was found after the scan.
                        </p>
                      </div>
                    </div>
                  )}

                {selectedButton === DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY &&
                  selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK &&
                  thirdPartyBookmarkData && (
                    <div className="border-2 rounded-xl border-input-border">
                      <table className="bg-white  w-full rounded-xl">
                        {/* Render employee data table */}
                        <thead>
                          {/* Table header */}
                          <tr className="border-b-[1px] border-[#D5D5D5] w-full">
                            <td className="py-[19px] px-[16px]  border-r-[1px] border-input-border border-dashed ">
                              No
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Date compromised
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              URL
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Login
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Password
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Password strength
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                              Status
                            </td>
                            <td className="py-[19px] px-[16px]">Action</td>
                          </tr>
                        </thead>
                        <tbody className="text-Base-normal text-text-description">
                          {thirdPartyBookmarkData.data.map((data, index) => (
                            <tr
                              className="border-b-[2px] border-[#D5D5D5]"
                              key={data.id}
                            >
                              {/* Render employee data row */}
                              <td className="py-[19px] px-[16px]">
                                {initialCheckboxState ? (
                                  <ConfigProvider
                                    theme={{
                                      token: {
                                        colorPrimary: "#FF6F1E",
                                      },
                                    }}
                                  >
                                    <Checkbox
                                      onChange={(e) =>
                                        handleGatheringIds(
                                          e,
                                          data.id,
                                          DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY
                                        )
                                      }
                                    ></Checkbox>
                                  </ConfigProvider>
                                ) : (
                                  index + 1
                                )}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {convertDateFormat(data.datetime_added)}
                              </td>
                              <td className="py-[19px] px-[16px] w-[100px] text-wrap">
                                <p
                                  style={{
                                    maxWidth: "200px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  <a
                                    href={`${data.url}`}
                                    target="_blank"
                                    className="underline"
                                  >
                                    {data.url}
                                  </a>
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px] text-wrap w-[100px] whitespace-pre-line">
                                <p
                                  style={{
                                    maxWidth: "170px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  {data.login}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <p
                                  style={{
                                    maxWidth: "140px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  {data.password}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <p
                                  className={clsx(
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Bad" && "text-error",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Weak" && "text-pink",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Medium" && "text-text-orange",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Good" && "text-blue-600",
                                    CalculatePasswordStrengthWithReturnPlainString(
                                      data.password
                                    ) === "Strong" && "text-text-green"
                                  )}
                                >
                                  {CalculatePasswordStrengthWithReturnPlainString(
                                    data.password
                                  )}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {data.status_validasi !== "-" && (
                                  <ConfigProvider
                                    theme={{
                                      token: {
                                        colorBgContainer: `${
                                          data.status_validasi === "invalid"
                                            ? "#F7F7F7"
                                            : "white"
                                        }`,
                                        colorBorder: `${
                                          data.status_validasi === "invalid"
                                            ? "#D5D5D5"
                                            : "#52C41A"
                                        }`,
                                        colorText: `${
                                          data.status_validasi === "invalid"
                                            ? "#000000E0"
                                            : "#52C41A"
                                        }`,
                                        fontWeightStrong: true,
                                      },
                                      components: {
                                        Select: {
                                          optionActiveBg: "#F7F7F7",
                                          optionSelectedBg: "#FFEBD4",
                                        },
                                      },
                                    }}
                                  >
                                    <Select
                                      defaultValue={data.status_validasi}
                                      value={data.status_validasi}
                                      style={{ width: 91 }}
                                      disabled={true}
                                      onChange={(value) =>
                                        handleSelectValidation(
                                          value,
                                          data.id,
                                          DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY
                                        )
                                      }
                                      options={[
                                        {
                                          value: "invalid",
                                          label: "Invalid",
                                        },

                                        {
                                          value: "valid",
                                          label: "Valid",
                                        },
                                      ]}
                                    />
                                  </ConfigProvider>
                                )}
                                {data.status_validasi === "-" && (
                                  <p> {data.status_validasi} </p>
                                )}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <div className="flex">
                                  <div
                                    className="cursor-pointer"
                                    onClick={() =>
                                      handleDetails(
                                        data,
                                        DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY,
                                        DETAIL_COMPROMISED_BOOKMARK
                                      )
                                    }
                                  >
                                    <EyeOutlined style={{ fontSize: "18px" }} />
                                  </div>
                                  <div
                                    className="ml-auto mr-auto cursor-pointer"
                                    onClick={() =>
                                      handleUnBookmarkConfirm(
                                        data.id,
                                        DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY
                                      )
                                    }
                                  >
                                    <BookFilled
                                      style={{
                                        fontSize: "18px",
                                        color: "#FFD591",
                                      }}
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/* Render pagination */}
                      <div className="flex items-center justify-between my-[19px] mx-[16px]">
                        <p className="text-Base-normal text-[#676767] ">
                          Showing {thirdPartyBookmarkData.size} to{" "}
                          {thirdPartyBookmarkData.count} entries
                        </p>
                        <div>
                          <ConfigProvider
                            theme={{
                              components: {
                                Pagination: {
                                  itemActiveBg: "#FF6F1E",
                                  itemLinkBg: "#fff",
                                  itemInputBg: "#fff",
                                },
                              },
                              token: {
                                colorPrimary: "white",
                              },
                            }}
                          >
                            <Pagination
                              type="primary"
                              defaultCurrent={1}
                              total={thirdPartyBookmarkData.count}
                              showSizeChanger={false}
                              style={{ color: "#FF6F1E" }}
                              hideOnSinglePage={true}
                              onChange={handlesetPageThirdPartyBookmark}
                              current={pageThirdPartyBookmark}
                            />
                          </ConfigProvider>
                        </div>
                      </div>
                    </div>
                  )}

                {selectedButton === DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY &&
                  selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK &&
                  thirdPartyBookmarkData === null && (
                    <div className="text-center flex flex-col justify-center items-center">
                      <div>
                        <Image
                          src={"/images/no_result_found_compromised.svg"}
                          alt="search icon"
                          width={129}
                          height={121}
                        />
                      </div>
                      <div className="mt-5">
                        <h1 className="text-heading-3">No results found</h1>
                        <p className="text-text-description text-LG-normal mt-4">
                          Nothing was found after the scan.
                        </p>
                      </div>
                    </div>
                  )}

                {selectedButton === DETAIL_COMPROMISED_COMPROMISE_DEVICES &&
                  selectedOutlineButton === DETAIL_COMPROMISED_DEFAULT &&
                  devicesData && (
                    <div className="border-2 rounded-xl border-input-border">
                      <table className="bg-white  w-full rounded-xl">
                        {/* Render employee data table */}
                        <thead>
                          {/* Table header */}
                          <tr className="border-b-[1px] border-[#D5D5D5] w-full">
                            <td className="py-[19px] px-[16px]  border-r-[1px] border-input-border border-dashed ">
                              No
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed w-[360px]">
                              Date compromised
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed w-[360px]">
                              Devices name
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed w-[360px]">
                              IP address
                            </td>
                            <td className="py-[19px] px-[16px]">Action</td>
                          </tr>
                        </thead>
                        <tbody className="text-Base-normal text-text-description">
                          {devicesData.data.map((data, index) => (
                            <tr
                              className="border-b-[2px] border-[#D5D5D5]"
                              key={data.id}
                            >
                              {/* Render employee data row */}
                              <td className="py-[19px] px-[16px]">
                                {initialCheckboxState ? (
                                  <ConfigProvider
                                    theme={{
                                      token: {
                                        colorPrimary: "#FF6F1E",
                                      },
                                    }}
                                  >
                                    <Checkbox
                                      onChange={(e) =>
                                        handleGatheringIds(
                                          e,
                                          data.id,
                                          DETAIL_COMPROMISED_COMPROMISE_DEVICES
                                        )
                                      }
                                    ></Checkbox>
                                  </ConfigProvider>
                                ) : (
                                  index + 1
                                )}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {data.date}
                              </td>
                              <td className="py-[19px] px-[16px] w-[100px] text-wrap">
                                {data.devices_name}
                              </td>
                              <td className="py-[19px] px-[16px] text-wrap w-[100px]">
                                {data.ip}
                              </td>

                              <td className="py-[19px] px-[16px]">
                                {data.action}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/* Render pagination */}
                      <div className="flex items-center justify-between my-[19px] mx-[16px]">
                        <p className="text-Base-normal text-[#676767] ">
                          Showing {devicesData.size} to {devicesData.count}{" "}
                          entries
                        </p>
                        <div>
                          <ConfigProvider
                            theme={{
                              components: {
                                Pagination: {
                                  itemActiveBg: "#FF6F1E",
                                  itemLinkBg: "#fff",
                                  itemInputBg: "#fff",
                                },
                              },
                              token: {
                                colorPrimary: "white",
                              },
                            }}
                          >
                            <Pagination
                              type="primary"
                              defaultCurrent={1}
                              total={devicesData.count}
                              showSizeChanger={false}
                              style={{ color: "#FF6F1E" }}
                              hideOnSinglePage={true}
                              onChange={handlesetPageDevices}
                              current={pageDevices}
                            />
                          </ConfigProvider>
                        </div>
                      </div>
                    </div>
                  )}
                {selectedButton === DETAIL_COMPROMISED_COMPROMISE_DEVICES &&
                  selectedOutlineButton === DETAIL_COMPROMISED_DEFAULT &&
                  devicesData === null && (
                    <div className="text-center flex flex-col justify-center items-center">
                      <div>
                        <Image
                          src={"/images/no_result_found_compromised.svg"}
                          alt="search icon"
                          width={129}
                          height={121}
                        />
                      </div>
                      <div className="mt-5">
                        <h1 className="text-heading-3">No results found</h1>
                        <p className="text-text-description text-LG-normal mt-4">
                          Nothing was found after the scan.
                        </p>
                      </div>
                    </div>
                  )}

                {selectedButton === DETAIL_COMPROMISED_COMPROMISE_DEVICES &&
                  selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK &&
                  devicesBookmarkData && (
                    <div className="border-2 rounded-xl border-input-border">
                      <table className="bg-white  w-full rounded-xl">
                        {/* Render employee data table */}
                        <thead>
                          {/* Table header */}
                          <tr className="border-b-[1px] border-[#D5D5D5] w-full">
                            <td className="py-[19px] px-[16px]  border-r-[1px] border-input-border border-dashed ">
                              No
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed w-[360px]">
                              Date compromised
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed w-[360px]">
                              Devices name
                            </td>
                            <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed w-[360px]">
                              IP address
                            </td>
                            <td className="py-[19px] px-[16px]">Action</td>
                          </tr>
                        </thead>
                        <tbody className="text-Base-normal text-text-description">
                          {devicesBookmarkData.data.map((data, index) => (
                            <tr
                              className="border-b-[2px] border-[#D5D5D5]"
                              key={data.id}
                            >
                              {/* Render employee data row */}
                              <td className="py-[19px] px-[16px]">
                                {initialCheckboxState ? (
                                  <ConfigProvider
                                    theme={{
                                      token: {
                                        colorPrimary: "#FF6F1E",
                                      },
                                    }}
                                  >
                                    <Checkbox
                                      onChange={(e) =>
                                        handleGatheringIds(
                                          e,
                                          data.id,
                                          DETAIL_COMPROMISED_COMPROMISE_DEVICES
                                        )
                                      }
                                    ></Checkbox>
                                  </ConfigProvider>
                                ) : (
                                  index + 1
                                )}
                              </td>

                              <td className="py-[19px] px-[16px]">
                                {convertDateFormat(data.datetime_added)}
                              </td>
                              <td className="py-[19px] px-[16px] w-[100px] text-wrap">
                                {data.computer_name}
                              </td>
                              <td className="py-[19px] px-[16px] text-wrap w-[100px]">
                                {data.ip}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <div className="flex">
                                  <div
                                    className="cursor-pointer"
                                    onClick={() =>
                                      handleDetails(
                                        data,
                                        DETAIL_COMPROMISED_COMPROMISE_DEVICES,
                                        DETAIL_COMPROMISED_BOOKMARK
                                      )
                                    }
                                  >
                                    <EyeOutlined style={{ fontSize: "18px" }} />
                                  </div>
                                  <div
                                    className="ml-auto mr-auto cursor-pointer"
                                    onClick={() =>
                                      handleUnBookmarkConfirm(
                                        data.id,
                                        DETAIL_COMPROMISED_COMPROMISE_DEVICES
                                      )
                                    }
                                  >
                                    <BookFilled
                                      style={{
                                        fontSize: "18px",
                                        color: "#FFD591",
                                      }}
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/* Render pagination */}
                      <div className="flex items-center justify-between my-[19px] mx-[16px]">
                        <p className="text-Base-normal text-[#676767] ">
                          Showing {devicesBookmarkData.size} to{" "}
                          {devicesBookmarkData.count} entries
                        </p>
                        <div>
                          <ConfigProvider
                            theme={{
                              components: {
                                Pagination: {
                                  itemActiveBg: "#FF6F1E",
                                  itemLinkBg: "#fff",
                                  itemInputBg: "#fff",
                                },
                              },
                              token: {
                                colorPrimary: "white",
                              },
                            }}
                          >
                            <Pagination
                              type="primary"
                              defaultCurrent={1}
                              total={devicesBookmarkData.count}
                              showSizeChanger={false}
                              style={{ color: "#FF6F1E" }}
                              hideOnSinglePage={true}
                              onChange={handlesetPageDevicesBookmark}
                              current={pageDevicesBookmark}
                            />
                          </ConfigProvider>
                        </div>
                      </div>
                    </div>
                  )}

                {selectedButton === DETAIL_COMPROMISED_COMPROMISE_DEVICES &&
                  selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK &&
                  devicesBookmarkData === null && (
                    <div className="text-center flex flex-col justify-center items-center">
                      <div>
                        <Image
                          src={"/images/no_result_found_compromised.svg"}
                          alt="search icon"
                          width={129}
                          height={121}
                        />
                      </div>
                      <div className="mt-5">
                        <h1 className="text-heading-3">No results found</h1>
                        <p className="text-text-description text-LG-normal mt-4">
                          Nothing was found after the scan.
                        </p>
                      </div>
                    </div>
                  )}
              </>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

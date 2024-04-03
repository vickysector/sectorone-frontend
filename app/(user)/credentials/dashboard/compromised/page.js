"use client";

import { dataOverview } from "@/app/_lib/TempDataOverview";
import ChangeUrlButton from "@/app/_ui/components/buttons/ChangeUrlButton";
import CompromiseButton from "@/app/_ui/components/buttons/CompromiseButton";
import OutlineButton from "@/app/_ui/components/buttons/OutlineButton";
import OverviewCard from "@/app/_ui/dashboard/OverviewCard";
import "@/app/_ui/CheckboxCustom2.css";
import clsx from "clsx";
import Image from "next/image";
import ExportButton from "@/app/_ui/components/buttons/ExportButton";
import {
  EyeOutlined,
  BookOutlined,
  CheckCircleFilled,
  BookFilled,
} from "@ant-design/icons";
import { Pagination, ConfigProvider, DatePicker, Spin, Select } from "antd";
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

const { RangePicker } = DatePicker;

export default function CompromisedDashboard() {
  const [showDate, setShowDate] = useState(false);
  const [selectedButton, setSelectedButton] = useState(
    DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE
  );
  const [selectedOutlineButton, setSelectedOutlineButton] = useState(
    DETAIL_COMPROMISED_DEFAULT
  );
  const [dataSource, setDataSource] = useState();
  const [lastId, setLastId] = useState("");
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
  const [devicesValidatedData, setDevicesValidatedData] = useState(null);

  console.log("last id ", lastId);
  console.log("start date  ", startDate);
  console.log("end date ", endDate);

  const loadingCompromisedData = useSelector(
    (state) => state.compromised.status
  );

  const dispatch = useDispatch();

  const domainUsers = useSelector((state) => state.chooseUrl.urlData);

  const breachesAll = useSelector((state) => state.breaches.breachesAll);

  const employeeBreaches = useSelector(
    (state) => state.breaches.breachesEmployee
  );

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

  const usersBreaches = useSelector((state) => state.breaches.breachesUsers);

  const urlBreaches = useSelector((state) => state.breaches.url);

  const iconBreaches = useSelector((state) => state.breaches.icon);

  const lastUpdate = useSelector((state) => state.breaches.lastUpdate);

  const handleChangeUrlOpen = (value) => {
    dispatch(setChangeUrl(true));
  };

  const handleDetails = (item) => {
    dispatch(setDetailState(true));
    dispatch(setDataDetails(item));
  };

  const handleRangePicker = (date, datestring) => {
    // console.log("date : ", date);
    // console.log("datestring: ", datestring);
    setStartDate(datestring[0]);
    setEndDate(datestring[1]);
  };

  const handleSearchKeyword = (e) => {
    setInputSearch(e.target.value);
  };

  const handleClickSearch = () => {
    switch (selectedButton) {
      case DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE:
        fetchEmployeeData(inputSearch);
        if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
          fetchEmployeeBookmark(inputSearch);
        } else if (selectedOutlineButton === DETAIL_COMPROMISED_TESTING) {
          fetchEmployeeTesting(inputSearch);
        } else {
          fetchEmployeeData(inputSearch);
        }
        break;
      case DETAIL_COMPROMISED_COMPROMISE_DEVICES:
        fetchDevicesData(inputSearch);
        break;
      // Add more cases for other buttons if needed
      case DETAIL_COMPROMISED_COMPROMISE_USERS:
        fetchUsersData(inputSearch);
        if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
          fetchUserBookmark(inputSearch);
        } else if (selectedOutlineButton === DETAIL_COMPROMISED_TESTING) {
          fetchUserTesting(inputSearch);
        } else {
          fetchUsersData(inputSearch);
        }
        break;
      case DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY:
        fetchThirdPartyData(inputSearch);
        break;
      default:
        break;
    }
  };

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
          <div className="cursor-pointer" onClick={() => handleDetails(item)}>
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
          <div className="cursor-pointer" onClick={() => handleDetails(item)}>
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
          <div className="cursor-pointer" onClick={() => handleDetails(item)}>
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
          <div className="cursor-pointer" onClick={() => handleDetails(item)}>
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

  const handleSelectValidation = (value, id) => {
    setSelectValidasi(value);

    UpdateValidateTesting(id, value);
  };

  const UpdateValidateTesting = async (id, validasi) => {
    try {
      dispatch(setLoadingState(true));
      const res = await fetch(`${APIDATAV1}status/domain/employee`, {
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
        DeleteCookies();
        RedirectToLogin();
      }

      const data = await res.json();

      if (data.success === false) {
        throw new Error("");
      }

      if (data.success) {
        setValidasiSuccess(true);
      }
    } catch (error) {
      setValidasiSuccess(false);
    } finally {
      dispatch(setLoadingState(false));
      setTimeout(() => {
        setValidasiSuccess(null);
      }, 5000);
    }
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
    }
    // else if (selectButton === DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY) {
    //   return thirdPartyData && thirdPartyData.count
    // } else {
    //   return devicesData && devicesData.count
    // }
  };

  const GetOutlineTotalDataBookmarkedOutlineButton = (selectButton) => {
    if (selectButton === DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE) {
      return employeeBookmarkData && employeeBookmarkData.count;
    } else if (selectButton === DETAIL_COMPROMISED_COMPROMISE_USERS) {
      return usersBookmarkData && usersBookmarkData.count;
    }
    // else if (selectButton === DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY) {
    //   return thirdPartyData && thirdPartyData.count
    // } else {
    //   return devicesData && devicesData.count
    // }
  };

  // Start of: Fetch Data compromised

  const fetchEmployeeData = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));
      const res = await fetch(
        `${APIDATAV1}compromised/employee?last_id=${lastId}&start_date=${startDate}&end_date=${endDate}&search=${keyword}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        DeleteCookies();
        RedirectToLogin();
      }

      const data = await res.json();

      if (data.data === null) {
        throw new Error("");
      }

      console.log("data employee: ", data);

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
      }
    } catch (error) {
      // setDataSource(null);
      setEmployeeData(null);
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchUsersData = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));
      const res = await fetch(
        `${APIDATAV1}compromised/users?last_id=${lastId}&start_date=${startDate}&end_date=${endDate}&search=${keyword}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        DeleteCookies();
        RedirectToLogin();
      }

      const data = await res.json();

      if (data.data === null) {
        throw new Error("");
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
      }
    } catch (error) {
      // setDataSource(null);
      setUsersData(null);
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchThirdPartyData = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));
      const res = await fetch(
        `${APIDATAV1}compromised/thirdparty?last_id=${lastId}&start_date=${startDate}&end_date=${endDate}&search=${keyword}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        DeleteCookies();
        RedirectToLogin();
      }

      const data = await res.json();

      if (data.data === null) {
        throw new Error("");
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
      }
    } catch (error) {
      // setDataSource(null);
      setThirdPartyData(null);
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchDevicesData = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));
      const res = await fetch(
        `${APIDATAV1}compromised/devices?last_id=${lastId}&start_date=${startDate}&end_date=${endDate}&search=${keyword}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        DeleteCookies();
        RedirectToLogin();
      }

      const data = await res.json();

      if (data.data === null) {
        throw new Error("");
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
      }
    } catch (error) {
      // setDataSource(null);
      setDevicesData(null);
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchEmployeeBookmark = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));
      const res = await fetch(
        `${APIDATAV1}status/domain/employee?status=bookmark&last_id=${lastId}&start_date=${startDate}&end_date=${endDate}&search=${keyword}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        DeleteCookies();
        RedirectToLogin();
      }

      const data = await res.json();

      if (data.data === null) {
        throw new Error("");
      }

      if (data.data) {
        setEmployeeBookmarkData({
          data: data.data,
          count: data.count_data,
          size: data.size,
        });
      }
    } catch (error) {
      setEmployeeBookmarkData(null);
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchEmployeeTesting = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));
      const res = await fetch(
        `${APIDATAV1}status/domain/employee?status=testing&last_id=${lastId}&start_date=${startDate}&end_date=${endDate}&search=${keyword}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        DeleteCookies();
        RedirectToLogin();
      }

      const data = await res.json();

      if (data.data === null) {
        throw new Error("");
      }

      if (data.data) {
        setEmployeeValidatedData({
          data: data.data,
          count: data.count_data,
          size: data.size,
        });
      }
    } catch (error) {
      setEmployeeValidatedData(null);
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchUserBookmark = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));
      const res = await fetch(
        `${APIDATAV1}status/domain/users?status=bookmark&last_id=${lastId}&start_date=${startDate}&end_date=${endDate}&search=${keyword}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        DeleteCookies();
        RedirectToLogin();
      }

      const data = await res.json();

      if (data.data === null) {
        throw new Error("");
      }

      if (data.data) {
        setUsersBookmarkData({
          data: data.data,
          count: data.count_data,
          size: data.size,
        });
      }
    } catch (error) {
      setUsersBookmarkData(null);
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchUserTesting = async (keyword = "") => {
    try {
      dispatch(setLoadingState(true));
      const res = await fetch(
        `${APIDATAV1}status/domain/users?status=testing&last_id=${lastId}&start_date=${startDate}&end_date=${endDate}&search=${keyword}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        DeleteCookies();
        RedirectToLogin();
      }

      const data = await res.json();

      if (data.data === null) {
        throw new Error("");
      }

      if (data.data) {
        setUsersValidatedData({
          data: data.data,
          count: data.count_data,
          size: data.size,
        });
      }
    } catch (error) {
      setUsersValidatedData(null);
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const handleButtonClick = (value) => {
    setSelectedButton(value.target.name);
    setInputSearch("");
    setStartDate("");
    setEndDate("");
    setTotalRows("");
    setSelectedOutlineButton(DETAIL_COMPROMISED_DEFAULT);
  };

  const handleButtonOutlineClick = (value) => {
    setSelectedOutlineButton(value.target.name);
    setInputSearch("");
    setStartDate("");
    setEndDate("");
    setTotalRows("");
  };

  useEffect(() => {
    fetchEmployeeData(inputSearch);
    fetchUsersData(inputSearch);
    fetchThirdPartyData(inputSearch);
    fetchDevicesData(inputSearch);
  }, []);

  useEffect(() => {
    if (selectedButton === DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE) {
      fetchEmployeeData();
      fetchEmployeeBookmark();
      fetchEmployeeTesting();
    } else if (selectedButton === DETAIL_COMPROMISED_COMPROMISE_USERS) {
      fetchUsersData();
      fetchUserBookmark();
      fetchUserTesting();
    }
  }, [selectedButton]);

  useEffect(() => {
    // fetchEmployeeData();
    switch (selectedButton) {
      case DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE:
        fetchEmployeeData(inputSearch);
        if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
          fetchEmployeeBookmark(inputSearch);
        } else if (selectedOutlineButton === DETAIL_COMPROMISED_TESTING) {
          fetchEmployeeTesting(inputSearch);
        } else {
          fetchEmployeeData(inputSearch);
        }
        break;
      case DETAIL_COMPROMISED_COMPROMISE_DEVICES:
        fetchDevicesData(inputSearch);
        break;
      // Add more cases for other buttons if needed
      case DETAIL_COMPROMISED_COMPROMISE_USERS:
        fetchUsersData(inputSearch);
        if (selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK) {
          fetchUserBookmark(inputSearch);
        } else if (selectedOutlineButton === DETAIL_COMPROMISED_TESTING) {
          fetchUserTesting(inputSearch);
        } else {
          fetchUsersData(inputSearch);
        }
        break;
      case DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY:
        fetchThirdPartyData(inputSearch);
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
  ]);

  // End of: Fetch Data compromised

  return (
    <main>
      <h1 className="text-heading-2 text-black mb-4">Compromised</h1>
      <div className="bg-white  p-12 rounded-xl">
        <div className="flex items-center">
          <div className="h-[80px] w-[80px] bg-input-container ">
            <Image
              width={80}
              height={80}
              src={iconBreaches && iconBreaches}
              alt="Icon Logo Users"
              // style={{
              //   objectFit: "cover",
              //   backgroundSize: "cover",
              //   width: "100%",
              // }}
            />
          </div>
          <div className="ml-4">
            <h1 className="text-heading-3">{urlBreaches && urlBreaches}</h1>
            <h2 className="text-LG-strong text-text-description mt-2">
              {lastUpdate && lastUpdate}
            </h2>
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
        <div className="mt-8 flex justify-between">
          <OverviewCard
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
          />
        </div>
      </div>
      <section className="mt-10">
        <h1 className="text-heading-4 text-black">Detail compromised</h1>
        <div className="mt-4 bg-white border-2 border-input-border rounded-lg">
          <section className="p-8 border-b-2 border-input-border ">
            <CompromiseButton
              isActive={
                selectedButton === DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE
              }
              total={employeeData && employeeData.count}
              value={"Employee"}
              onClick={handleButtonClick}
              nameData={DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE}
            />

            <CompromiseButton
              isActive={selectedButton === DETAIL_COMPROMISED_COMPROMISE_USERS}
              total={usersData && usersData.count}
              value={"User"}
              onClick={handleButtonClick}
              nameData={DETAIL_COMPROMISED_COMPROMISE_USERS}
            />

            <CompromiseButton
              isActive={
                selectedButton === DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY
              }
              total={totalThirdParty && totalThirdParty}
              value={"Third-party"}
              onClick={handleButtonClick}
              nameData={DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY}
            />

            <CompromiseButton
              isActive={
                selectedButton === DETAIL_COMPROMISED_COMPROMISE_DEVICES
              }
              total={totalDevice && totalDevice}
              value={"Device"}
              onClick={handleButtonClick}
              nameData={DETAIL_COMPROMISED_COMPROMISE_DEVICES}
            />
          </section>
          <section className="p-8">
            <OutlineButton
              isActive={selectedOutlineButton === DETAIL_COMPROMISED_DEFAULT}
              total={GetOutlineTotalDataCompromiseOutlineButton(selectedButton)}
              value={"Data compromise "}
              onClick={handleButtonOutlineClick}
              nameData={DETAIL_COMPROMISED_DEFAULT}
            />
            <OutlineButton
              isActive={selectedOutlineButton === DETAIL_COMPROMISED_TESTING}
              total={GetOutlineTotalDataValidatedOutlineButton(selectedButton)}
              value={"Validated "}
              onClick={handleButtonOutlineClick}
              nameData={DETAIL_COMPROMISED_TESTING}
            />
            <OutlineButton
              isActive={selectedOutlineButton === DETAIL_COMPROMISED_BOOKMARK}
              total={GetOutlineTotalDataBookmarkedOutlineButton(selectedButton)}
              value={"Bookmark "}
              onClick={handleButtonOutlineClick}
              nameData={DETAIL_COMPROMISED_BOOKMARK}
            />

            <div className="mt-8 ">
              <div className="flex items-center">
                <div>
                  <input
                    type="checkbox"
                    name=""
                    id="agreements"
                    value="I agree to the Terms & Conditions and Privacy Policy"
                    className=" text-Base-normal"
                  />
                  <label
                    htmlFor="agreements"
                    className="text-Base-normal ml-1.5 text-text-description"
                  ></label>
                </div>
                <div className="ml-4 bg-input-container border-input-border flex items-center justify-between border-t-2 border-b-2 border-r-2 rounded-lg w-[400px]">
                  <input
                    type="email"
                    className={clsx(
                      " bg-transparent  py-1.5 px-3  border-r-2  text-Base-normal w-full  "
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
                <div>
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
                      renderExtraFooter={() => "extra footer"}
                      onChange={handleRangePicker}
                      className="ml-8"
                      size="large"
                    />
                  </ConfigProvider>
                </div>
                <div className="ml-auto ">
                  <ExportButton />
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
                                {" "}
                                {index + 1}{" "}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {data.date}
                              </td>
                              <td className="py-[19px] px-[16px] w-[100px] text-wrap">
                                {data.url}
                              </td>
                              <td className="py-[19px] px-[16px] text-wrap w-[100px] whitespace-pre-line">
                                <p className="text-wrap whitespace-pre-line">
                                  {data.login}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {data.pass}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <p
                                  className={clsx(
                                    "Medium" === "Weak" && "text-pink",
                                    "Medium" === "Medium" && "text-text-orange",
                                    "Medium" === "Strong" && "text-text-green"
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
                          Try different keywords or remove search filters
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
                                {" "}
                                {index + 1}{" "}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {convertDateFormat(data.datetime_added)}
                              </td>
                              <td className="py-[19px] px-[16px] w-[100px] text-wrap">
                                {data.url}
                              </td>
                              <td className="py-[19px] px-[16px] text-wrap w-[100px] whitespace-pre-line">
                                <p className="text-wrap whitespace-pre-line">
                                  {data.login}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {data.password}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <p
                                  className={clsx(
                                    "Medium" === "Weak" && "text-pink",
                                    "Medium" === "Medium" && "text-text-orange",
                                    "Medium" === "Strong" && "text-text-green"
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
                                    value={selectValidasi}
                                    style={{ width: 91 }}
                                    onChange={(value) =>
                                      handleSelectValidation(value, data.id)
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
                                    onClick={() => handleDetails(data)}
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
                                    <BookOutlined
                                      style={{ fontSize: "18px" }}
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
                          Try different keywords or remove search filters
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
                                {" "}
                                {index + 1}{" "}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {convertDateFormat(data.datetime_added)}
                              </td>
                              <td className="py-[19px] px-[16px] w-[100px] text-wrap">
                                {data.url}
                              </td>
                              <td className="py-[19px] px-[16px] text-wrap w-[100px] whitespace-pre-line">
                                <p className="text-wrap whitespace-pre-line">
                                  {data.login}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {data.password}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <p
                                  className={clsx(
                                    "Medium" === "Weak" && "text-pink",
                                    "Medium" === "Medium" && "text-text-orange",
                                    "Medium" === "Strong" && "text-text-green"
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
                                      value={selectValidasi}
                                      style={{ width: 91 }}
                                      onChange={(value) =>
                                        handleSelectValidation(value, data.id)
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
                                    onClick={() => handleDetails(data)}
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
                          Try different keywords or remove search filters
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
                                {" "}
                                {index + 1}{" "}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {data.date}
                              </td>
                              <td className="py-[19px] px-[16px] w-[100px] text-wrap">
                                {data.url}
                              </td>
                              <td className="py-[19px] px-[16px] text-wrap w-[100px] whitespace-pre-line">
                                <p className="text-wrap whitespace-pre-line">
                                  {data.login}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {data.pass}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <p
                                  className={clsx(
                                    "Medium" === "Weak" && "text-pink",
                                    "Medium" === "Medium" && "text-text-orange",
                                    "Medium" === "Strong" && "text-text-green"
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
                          Try different keywords or remove search filters
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
                                {" "}
                                {index + 1}{" "}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {convertDateFormat(data.datetime_added)}
                              </td>
                              <td className="py-[19px] px-[16px] w-[100px] text-wrap">
                                {data.url}
                              </td>
                              <td className="py-[19px] px-[16px] text-wrap w-[100px] whitespace-pre-line">
                                <p className="text-wrap whitespace-pre-line">
                                  {data.login}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {data.password}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <p
                                  className={clsx(
                                    "Medium" === "Weak" && "text-pink",
                                    "Medium" === "Medium" && "text-text-orange",
                                    "Medium" === "Strong" && "text-text-green"
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
                                    value={selectValidasi}
                                    style={{ width: 91 }}
                                    onChange={(value) =>
                                      handleSelectValidation(value, data.id)
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
                                    onClick={() => handleDetails(data)}
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
                                    <BookOutlined
                                      style={{ fontSize: "18px" }}
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
                          Try different keywords or remove search filters
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
                                {" "}
                                {index + 1}{" "}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {convertDateFormat(data.datetime_added)}
                              </td>
                              <td className="py-[19px] px-[16px] w-[100px] text-wrap">
                                {data.url}
                              </td>
                              <td className="py-[19px] px-[16px] text-wrap w-[100px] whitespace-pre-line">
                                <p className="text-wrap whitespace-pre-line">
                                  {data.login}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {data.password}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <p
                                  className={clsx(
                                    "Medium" === "Weak" && "text-pink",
                                    "Medium" === "Medium" && "text-text-orange",
                                    "Medium" === "Strong" && "text-text-green"
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
                                      value={selectValidasi}
                                      style={{ width: 91 }}
                                      onChange={(value) =>
                                        handleSelectValidation(value, data.id)
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
                                    onClick={() => handleDetails(data)}
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
                          Try different keywords or remove search filters
                        </p>
                      </div>
                    </div>
                  )}
                {selectedButton === DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY &&
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
                                {" "}
                                {index + 1}{" "}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {data.date}
                              </td>
                              <td className="py-[19px] px-[16px] w-[100px] text-wrap">
                                {data.url}
                              </td>
                              <td className="py-[19px] px-[16px] text-wrap w-[100px] whitespace-pre-line">
                                <p className="text-wrap whitespace-pre-line">
                                  {data.login}
                                </p>
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {data.pass}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <p
                                  className={clsx(
                                    "Medium" === "Weak" && "text-pink",
                                    "Medium" === "Medium" && "text-text-orange",
                                    "Medium" === "Strong" && "text-text-green"
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
                            />
                          </ConfigProvider>
                        </div>
                      </div>
                    </div>
                  )}
                {selectedButton === DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY &&
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
                          Try different keywords or remove search filters
                        </p>
                      </div>
                    </div>
                  )}

                {selectedButton === DETAIL_COMPROMISED_COMPROMISE_DEVICES &&
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
                                {" "}
                                {index + 1}{" "}
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
                            />
                          </ConfigProvider>
                        </div>
                      </div>
                    </div>
                  )}
                {selectedButton === DETAIL_COMPROMISED_COMPROMISE_DEVICES &&
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
                          Try different keywords or remove search filters
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

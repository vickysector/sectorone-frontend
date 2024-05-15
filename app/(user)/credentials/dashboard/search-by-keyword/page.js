"use client";

import { setLoadingState } from "@/app/_lib/store/features/Compromised/LoadingSlices";
import { AuthButton } from "@/app/_ui/components/buttons/AuthButton";
import { ConfigProvider, Pagination, Select } from "antd";
import clsx from "clsx";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, redirect } from "next/navigation";
import { setCookie, getCookie, hasCookie, deleteCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { fetchWithRefreshToken } from "@/app/_lib/token/fetchWithRefreshToken";
import { APIDATAV1 } from "@/app/_lib/helpers/APIKEYS";
import {
  setCallAddKeywordFunctions,
  setCallDeleteKeywordFunction,
  setIsAddedKeyword,
  setIsDeleteKeyword,
  setIsDetailActive,
} from "@/app/_lib/store/features/KeywordSearch/KeywordSearchSlices";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  LockOutlined,
} from "@ant-design/icons";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function SearchByKeyword() {
  const [usersCredit, setUsersCredit] = useState();
  const [categories, setCategories] = useState();
  const [selectedCategory, setSelectedCategory] = useState("1");
  const [keyword, setKeyword] = useState("");
  const [allKeywordsUser, setAllKeywordsUser] = useState([]);
  const [triggerChange, setTriggerChange] = useState(false);

  console.log("all keywords: ", allKeywordsUser);

  const canAdd = keyword;

  const handleSetCategories = (value) => {
    setSelectedCategory(value);
  };

  const handleChangeKeyword = (e) => {
    setKeyword(e.target.value);
  };

  const handleAddKeywordButton = () => {
    dispatch(setIsAddedKeyword(true));
    dispatch(setCallAddKeywordFunctions(callPostAddKeywordSearch));
  };

  const handleDeleteKeywordButton = (id) => {
    dispatch(setIsDeleteKeyword(true));
    dispatch(
      setCallDeleteKeywordFunction(() => callDeleteRemoveKeywordSearch(id))
    );
  };

  const handleDetailActive = () => {
    dispatch(setIsDetailActive(true));
  };

  const dispatch = useDispatch();
  const router = useRouter();

  const patchGetUsersStatus = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(`${APIDATAV1}information/keyword`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 400) {
        return res;
      }

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      if (data.error) {
        return res;
      }

      if (data.data === null) {
        throw res;
      }

      if (data.data) {
        setUsersCredit(data.data);
        return res;
      }
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const callPatchUsersStatusCredit = async () => {
    await fetchWithRefreshToken(patchGetUsersStatus, router, dispatch);
  };

  const fetchCategoriesKeyword = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(`${APIDATAV1}category/keyword`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 400) {
        return res;
      }

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      if (data.error) {
        return res;
      }

      if (data.data === null) {
        throw res;
      }

      if (data.data) {
        setCategories(data.data);
        return res;
      }
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const callFetchCategoriesKeyword = async () => {
    await fetchWithRefreshToken(fetchCategoriesKeyword, router, dispatch);
  };

  const fetchAllKeywordUsers = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(`${APIDATAV1}keyword`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 400) {
        return res;
      }

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      console.log("data keyword users: ", data);

      if (data.data === null) {
        setAllKeywordsUser([]);
        throw res;
      }

      if (data.data) {
        setAllKeywordsUser(data.data);
        return res;
      }
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const callFetchAllKeywordUsers = async () => {
    await fetchWithRefreshToken(fetchAllKeywordUsers, router, dispatch);
  };

  const postKeywordSearch = async () => {
    try {
      dispatch(setLoadingState(true));

      setTriggerChange(false);

      const res = await fetch(`${APIDATAV1}keyword`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_category_search: selectedCategory,
          search: keyword,
        }),
      });

      if (res.status === 400) {
        return res;
      }

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      if (data.data === null) {
        setAllKeywordsUser([]);
        throw res;
      }

      if (data.data) {
        setAllKeywordsUser(data.data);
        setKeyword("");
        setTriggerChange(true);
        return res;
      }
    } catch (error) {
      console.log("error add keyword: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const callPostAddKeywordSearch = async () => {
    await fetchWithRefreshToken(postKeywordSearch, router, dispatch);
  };

  const deleteKeywordSearch = async (id) => {
    try {
      dispatch(setLoadingState(true));

      setTriggerChange(false);

      const res = await fetch(`${APIDATAV1}keyword`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      });

      if (res.status === 400) {
        return res;
      }

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      if (data.data === null) {
        setTriggerChange(true);
        throw res;
      }
    } catch (error) {
      console.log("error Delete keyword: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const callDeleteRemoveKeywordSearch = async (id) => {
    await fetchWithRefreshToken(deleteKeywordSearch, router, dispatch, id);
  };

  useEffect(() => {
    setTriggerChange(false);
    callPatchUsersStatusCredit();
    callFetchCategoriesKeyword();
    callFetchAllKeywordUsers();
  }, [triggerChange]);

  return (
    <>
      <main>
        <section>
          <h1 className="text-black text-heading-2">Search by keyword</h1>

          <section className="bg-white rounded-lg shadow-sm p-10 mt-8">
            <h2 className="text-black text-heading-4">Add keyword</h2>
            <p className="mt-2 text-Base-normal text-text-description">
              Find data leaks based on the keywords you enter. You can only
              enter a maximum of 5 keywords.
            </p>

            <div className="mt-10 flex">
              <Select
                defaultValue={selectedCategory}
                value={selectedCategory}
                size="large"
                className="basis-1/5"
                onChange={handleSetCategories}
                options={
                  categories &&
                  categories.map((category) => ({
                    value: category.id,
                    label: category.category_search,
                  }))
                }
              />
              <input
                type="text"
                className={clsx(
                  "py-3 px-5 text-Base-normal text-[#000000E0] rounded-md border-[1px] border-input-border bg-[#F7F7F7] basis-4/5 ml-6 h-[40px]"
                )}
                placeholder="Type here..."
                value={keyword}
                onChange={handleChangeKeyword}
              />
            </div>
            <p className="text-SM-normal text-[#00000082] text-justify mt-4">
              You can only search a maximum of 10 searches.{" "}
              <span className="text-SM-strong text-primary-base">
                {usersCredit && usersCredit.credit}
              </span>{" "}
              Credits
            </p>
            <div className="mt-10 flex justify-end">
              <div>
                <AuthButton
                  value={"Add Keyword"}
                  agreements={canAdd}
                  onClick={handleAddKeywordButton}
                />
              </div>
            </div>
          </section>
        </section>

        <section className="mt-14">
          <h1 className="text-heading-4 text-black">Results of your keyword</h1>
          <section
            className={clsx(
              "bg-white rounded-lg shadow-sm py-8 px-14 text-center mt-8",
              allKeywordsUser.length === 0 ? "visible" : "hidden"
            )}
          >
            <div>
              <Image
                src={"/images/sector_image_magnifier.svg"}
                alt="search icon"
                width={120}
                height={120}
                className="mx-auto"
              />
            </div>
            <h3 className="text-heading-4 text-black mt-6">
              Add in your keywords
            </h3>
            <p className="text-LG-normal text-text-description mt-4">
              There are no keywords that you have added yet.
            </p>
          </section>

          <section
            className={clsx(
              "bg-white rounded-lg shadow-sm py-8 px-14 text-center mt-8",
              allKeywordsUser.length > 0 ? "visible" : "hidden"
            )}
          >
            <div className="border-2 rounded-xl border-input-border w-full">
              <table className="bg-white  w-full rounded-xl text-left">
                <thead className="text-black text-Base-strong bg-[#00000005]">
                  <tr className="border-b-[1px] border-[#D5D5D5]">
                    <td className="py-[19px] px-[16px]  border-r-[1px] border-input-border border-dashed ">
                      No
                    </td>
                    <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                      Keyword
                    </td>
                    <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                      Leaked Data
                    </td>
                    <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                      Total Leakage
                    </td>
                    <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                      Actions
                    </td>
                  </tr>
                </thead>
                <tbody className="text-Base-normal text-text-description">
                  {allKeywordsUser.length > 0 &&
                    allKeywordsUser.map((data, index) => {
                      return (
                        <tr
                          className="border-b-[2px] border-[#D5D5D5]"
                          key={data.id}
                        >
                          <td className="py-[19px] px-[16px]"> {index + 1} </td>
                          <td className="py-[19px] px-[16px]">
                            {data.keyword}
                          </td>
                          <td className="py-[19px] px-[16px] w-[45%]">
                            {data.data_leak.map((key) => (
                              <>
                                <span
                                  className="inline-block bg-[#F7F7F7] rounded-lg text-[#00000040] text-SM-strong py-1 px-1.5 mr-2"
                                  key={key}
                                >
                                  {key}
                                </span>
                              </>
                            ))}
                          </td>
                          <td className="py-[19px] px-[16px]">
                            {data.count_data}
                          </td>
                          <td className="py-[19px] px-[16px]">
                            <DeleteOutlineIcon
                              className="cursor-pointer"
                              onClick={() => handleDeleteKeywordButton(data.id)}
                              style={{
                                color: "#00000040",
                                fontSize: "20px",
                              }}
                            />
                            <button
                              className="rounded-md border-[1px] border-input-border text-primary-base text-Base-normal py-1.5 px-4 ml-4"
                              onClick={handleDetailActive}
                            >
                              <span className="mr-2">
                                <LockOutlined style={{ color: "#FF6F1E" }} />
                              </span>
                              Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              <div className="flex items-center justify-between my-[19px] mx-[16px]">
                <p className="text-Base-normal text-[#676767] ">
                  Showing {allKeywordsUser.length > 0 && allKeywordsUser.length}{" "}
                  entries
                </p>
              </div>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}

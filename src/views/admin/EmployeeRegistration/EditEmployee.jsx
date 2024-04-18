// Chakra imports
import {
  Box,
  Checkbox,
  //  SimpleGrid
} from "@chakra-ui/react";
import { React, useContext, useEffect, useState } from "react";
import {
  Flex,
  Text,
  Select,
  useColorModeValue,
  Icon,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import { Container } from "@chakra-ui/react";
import {
  Input,
  InputLeftElement,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import "react-phone-number-input/style.css";

//New Imports//
import eye from "assets/img/icons/eye.svg";
import CmpIcon from "assets/img/icons/company.svg";
import HashTag from "assets/img/icons/Ahash.svg";
import vat from "assets/img/icons/vat.svg";
import AddPic from "assets/img/icons/AddPic.svg";
import Globe from "assets/img/icons/globe.svg";
import lock from "assets/img/icons/lock.svg";
import offCup from "assets/img/icons/cup.svg";
import location from "assets/img/icons/location.svg";
import hopper from "assets/img/icons/hopper.png";
import Emailicon from "assets/img/icons/email.svg";
import chair from "assets/img/icons/chair.svg";
import { Post } from "api/admin.services";
import PhoneInput from "react-phone-number-input";
import { Get } from "api/admin.services";
import { toast } from "react-toastify";
import Autocomplete from "react-google-autocomplete";
import useric from "assets/img/icons/user.svg";
import bankic from "assets/img/icons/bank.svg";
import sortcodeic from "assets/img/icons/sortcode.svg";
import accountic from "assets/img/icons/account.svg";
import dataContext from "../ContextFolder/Createcontext";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { useRef } from "react";
import { Patch } from "api/admin.services";
import Loader from "components/Loader";

export default function EmployeeRegistration() {
  const [isChecked, setIsChecked] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [designation, setDesigation] = useState([]);
  const [department, setDepartment] = useState([]);
  const [imageSelected, setImageSelected] = useState(false);
  const textColor = useColorModeValue("#000", "white");
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const history = useHistory();

  const { profile, setProfile } = useContext(dataContext);

  //compant detail
  const [companyDetails, setCompDetails] = useState({
    companyaddress: "",
    companynumber: "",
    vatnumber: "",
  });

  //  both are for country code start
  const [value1, setValue1] = useState("");
  const [value, setValue] = useState("+44");
  const searchBoxRefStreet = useRef(null);

  //  both are for country code end

  const [street_address, setstreet_address] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const [officeName, setOfficeName] = useState([]);

  const [officeDetail, setOfficeDetail] = useState({
    office_name: "PRSSHOP London",
    phone: "",
    country_code: "+44",
    email: "hello@presshop.co.uk",
    website: "www.presshop.co.uk",
    address: {
      pincode: "SW1X 7QA",
      country: "United Kingdom",
      city: "London",
      complete_address: "1 Knightsbridge Green",
      location: {
        coordinates: [0, 0],
      },
    },
  });

  // end

  const AddOffice = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in officeDetail) {
      formData.append(key, officeDetail[key]);
    }
    formData.delete("address");
    formData.append("address", JSON.stringify(officeDetail.address));

    try {
      const res = await Post(`admin/create/office/details`, formData);
      if (res) {
        toast.success("New Office Added");
        getOfficeName();

        // history.push("/admin/default")
      }
    } catch (error) {
      toast.error("An error occurred while adding the office");
    }
  };

  const [employeeDetail, setEmployeeDetail] = useState({
    name: "",
    designation_id: "",
    department_id: "",
    office_id: "",
    country_code: "+44",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    profile_image: "",
    subadmin_rights: {
      onboardEmployess: profile?.subadmin_rights?.onboardEmployess,
      blockRemoveEmployess: false,
      assignNewEmployeeRights: false,
      completeAccess: false,
      controlHopper: false,
      controlPublication: false,
      controlContent: false,
      viewRightOnly: false,
      other_rights: false,
    },

    employee_address: {
      // complete_address:"",

      coordinates: [0, 0],
      country: "",
    },

    bank_details: {
      account_holder_name: "",
      account_number: "",
      bank_name: "",
      sort_code: "",
    },
  });

  console.log("profile ------------>",profile);
  console.log("🚀 ~ EmployeeRegistration ~ employeeDetail:", employeeDetail)

  // hanfle address of employee
  const handleEmployeeAddress = (place) => {
    console.log("🚀 ~ handleEmployeeAddress ~ place:", place)
    let city = "";
    const addressComponents = place.address_components;
    if (addressComponents) {
      const cityComponent = addressComponents?.find(
        (component) =>
          component.types.includes("locality") ||
          component.types.includes("administrative_area_level_1") ||
          component.types.includes("administrative_area_level_2")
      );

      if (cityComponent) {
        city = cityComponent.long_name;
      }
    }

    if (!city && place.formatted_address) {
      city = place.formatted_address.split(",")[0];
    }

    const country =
      place.address_components.find((component) =>
        component.types.includes("country")
      )?.long_name || "";

    setEmployeeDetail((prevState) => ({
      ...prevState,
      employee_address: {
        ...prevState.employee_address,
        complete_address: place.formatted_address,
        coordinates: [
          place.geometry.location.lat(),
          place.geometry.location.lng(),
        ],

        country: country,
        city: city,
      },
    }));
  };

  // const AddNewEmployees = async (e) => {
  //     e.preventDefault();
  //     if (employeeDetail?.password !== employeeDetail?.confirmPassword) {
  //         toast.error("Password does not match");
  //     } else if (employeeDetail?.password.length < 8) {
  //         toast.error("Password is too short");
  //     } else {
  //         const formData = new FormData();
  //         formData.append("password", employeeDetail.password);
  //         formData.append("profile_image", employeeDetail.profile_image);
  //         formData.append("name", employeeDetail.name);
  //         formData.append("designation_id", employeeDetail.designation_id);
  //         formData.append("department_id", employeeDetail.department_id);
  //         formData.append("office_id", employeeDetail.office_id);
  //         formData.append("country_code", employeeDetail.country_code);
  //         formData.append("phone", employeeDetail.phone);
  //         formData.append("email", employeeDetail.email);
  //         formData.append("confirmPassword", employeeDetail.confirmPassword);
  //         formData.append(
  //             "bank_details",
  //             JSON.stringify(employeeDetail.bank_details)
  //         );
  //         formData.append(
  //             "subadmin_rights",
  //             JSON.stringify(employeeDetail.subadmin_rights)
  //         );
  //         formData.append(
  //             "employee_address",
  //             JSON.stringify(employeeDetail.employee_address)
  //         );

  //         try {
  //             const res = await Post(`admin/addEmployee`, formData);
  //             toast.success("Add New Employee");
  //             // history.push("/admin/default")
  //         } catch (errors) {
  //             if (errors) {
  //                 toast.error(
  //                     errors?.response?.data?.errors?.msg ===
  //                         "Admin validation failed: email: EMAIL_IS_NOT_VALID"
  //                         ? "EMAIL_IS_NOT_VALID"
  //                         : errors?.response?.data?.errors?.msg === "EMAIL_ALREADY_EXISTS"
  //                             ? "EMAIL_ALREADY_EXISTS"
  //                             : ""
  //                 );
  //             }
  //         }
  //     }
  // };

  // get category

  const getCategory = async (type) => {
    try {
      const res = await Get(`admin/getCategory/${type}`);

      return res.data.categories;
    } catch (err) {
      console.log("<---Have a erro ->", err);
    }
  };

  const [editAbleProfile, setEditableProfile] = useState({
    password: "",
    cnf_password: "",
    profile_image: "",
  });

  const [loading, setLoading] = useState(false);
  const Edit = async (e) => {
    e.preventDefault();
    // if (editAbleProfile?.password !== editAbleProfile?.confirmPassword) {
    //   toast.error("Password does not match");
    // } else if (editAbleProfile?.password.length < 8) {
    //   toast.error("Password is too short");
    // } else {
        setLoading(true)
      const formData = new FormData();
    //   formData.append("admin_password", editAbleProfile.password);
    if(editAbleProfile.profile_image){
        formData.append("profile_image", editAbleProfile.profile_image);
    }
    if((editAbleProfile.password && editAbleProfile.cnf_password) && editAbleProfile.password == editAbleProfile.cnf_password){
        formData.append("admin_password", editAbleProfile.password);
    }
    if(employeeDetail?.employee_address?.complete_address){
      formData.append("employee_address", JSON.stringify(employeeDetail?.employee_address));
    }
      formData.append("id", profile?._id);
      formData.append("_id", profile?._id);
      try {
        await Patch(`admin/editProfile`, formData).then((res) => {
          if (res) {
            setLoading(false);
            toast.success(`Profile Edited`);
          }
        });
      } catch (err) {
        setLoading(false);
      }
    // }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setEditableProfile((previousValue) => {
      return { ...previousValue, profile_image: file };
    });

    const objectUrl = URL.createObjectURL(e.target.files[0]);
    setImagePreview(objectUrl);
    setImageSelected(true);
    if (
      employeeDetail.profile_image &&
      typeof employeeDetail.profile_image !== "string"
    ) {
      URL.revokeObjectURL(employeeDetail.profile_image);
    }
  };

  //  get office name

  const getOfficeName = async () => {
    await Get(`admin/get/office/details`).then((res) => {
      setOfficeName(res.data.office_details);
    });
  };

  useEffect(async () => {
    const designation = await getCategory("designation");
    setDesigation(designation);

    const department = await getCategory("department");
    setDepartment(department);

    getOfficeName();
  }, []);

  function handleCheckboxChange(event) {
    setIsChecked(event.target.checked);
    // setOfficeDetail({
    //     office_name: "",
    //     phone: "",
    //     country_code: "",
    //     email: "",
    //     website: "",
    //     address: {
    //         pincode: "",
    //         country: "",
    //         city: "",
    //         complete_address: "",
    //         location: {
    //             coordinates: [],
    //         },
    //     },
    // });
  }

  const handleStreetChange = (e) => {
    setstreet_address(e.target.value);
  };

  const handlePopupOpen = () => {
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const onMapLoadStreet = (map) => {
    const searchBox = new window.google.maps.places.SearchBox(
      searchBoxRefStreet.current
    );
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (places.length === 0) {
        return;
      }
      const loc = places[0].formatted_address;

      setstreet_address(loc);

      setOfficeDetail((prev) => ({
        ...prev,
        location: places[0].formatted_address,
        address_location: {
          coordinates: [
            places[0].geometry.location.lat(),
            places[0].geometry.location.lng(),
          ],
        },
      }));
    });
  };

  // const handleAddress = (place) => {
  //   let city = "";
  //   const addressComponents = place.address_components;
  //   if (addressComponents) {
  //     const cityComponent = addressComponents?.find(
  //       (component) =>
  //         component.types.includes("locality") ||
  //         component.types.includes("administrative_area_level_1") ||
  //         component.types.includes("administrative_area_level_2")
  //     );

  //     if (cityComponent) {
  //       city = cityComponent.long_name;
  //     }
  //   }

  //   if (!city && place.formatted_address) {
  //     city = place.formatted_address.split(",")[0];
  //   }

  //   const country =
  //     place.address_components.find((component) =>
  //       component.types.includes("country")
  //     )?.long_name || "";

  //   setOfficeDetail((previousValue) => ({
  //     ...previousValue,
  //     address: {
  //       ...previousValue.address,
  //       complete_address: place.formatted_address,
  //       location: {
  //         coordinates: [
  //           place.geometry.location.lat(),
  //           place.geometry.location.lng(),
  //         ],
  //       },
  //       country: country,
  //       city: city,
  //     },
  //   }));
  // };

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const toggleConfirmPasswordVisiblity = () => {
    setConfirmPasswordShown(confirmPasswordShown ? false : true);
  };

  //start edit development

  const handleCmpnyDetailChange = (e) => {
    setCompDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // console.log(companyDetails)

  return (
    <>
    {loading && <Loader/>}
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Card
        className="add_hopper admin_reg"
        direction="column"
        w="100%"
        px="0px"
        mb="24px"
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >
        <Container className="inner_card_wrap" maxW="1000px" color="black">
          <div className="brd_wrap">
            <Flex justify="space-between" mb="25px" align="center">
              <Text
                color={textColor}
                fontSize="22px"
                fontWeight="700"
                lineHeight="100%"
                fontFamily={"AirbnbBold"}
              >
                Company details
              </Text>
            </Flex>
            <div className="dtl_wrap">
              <Flex
                className="edit_inputs_wrap"
                px="0px"
                justify="space-between"
                mb="25px"
                align="center"
              >
                <InputGroup flex={1}>
                  <InputLeftElement pointerEvents="none">
                    <img src={CmpIcon} alt="" />
                  </InputLeftElement>
                  <Input
                    className="disabled"
                    type="text"
                    name="companyaddress"
                    disabled={profile?.role !== "admin"}
                    placeholder="Presso Media UK Limited"
                    value={companyDetails?.companyaddress}
                    onChange={handleCmpnyDetailChange}
                  />
                </InputGroup>
                <InputGroup flex={1}>
                  <InputLeftElement pointerEvents="none">
                    <img src={HashTag} alt="" />
                  </InputLeftElement>
                  <Input
                    className="disabled"
                    name="companynumber"
                    disabled={profile?.role !== "admin"}
                    placeholder="Company no 13522872"
                    value={companyDetails?.companynumber}
                    onChange={handleCmpnyDetailChange}
                  />
                </InputGroup>
                <InputGroup flex={1}>
                  <InputLeftElement pointerEvents="none">
                    <img src={vat} alt="" />
                  </InputLeftElement>
                  <Input
                    className="disabled"
                    name="vatnumber"
                    disabled={profile?.role !== "admin"}
                    placeholder="VAT no 6754 5532"
                    value={companyDetails?.vatnumber}
                    onChange={handleCmpnyDetailChange}
                  />
                </InputGroup>
              </Flex>
            </div>
          </div>

          {/* office detail section start */}
          <form onSubmit={AddOffice}>
            <div className="brd_wrap pd_in">
              <Flex justify="space-between" mb="25px" align="center">
                <Text
                  color={textColor}
                  fontSize="22px"
                  lineHeight="100%"
                  fontFamily={"AirbnbBold"}
                >
                  Office details
                </Text>
              </Flex>
              <div className="dtl_wrap">
                <Flex
                  className="edit_inputs_wrap"
                  px="0px"
                  justify="space-between"
                  mb="20px"
                  align="center"
                >
                  <InputGroup flex={1} maxW="307px">
                    <InputLeftElement pointerEvents="none">
                      <img src={offCup} alt="" />
                    </InputLeftElement>
                    <Input
                      disabled={!isChecked}
                      pattern="^(?!\s)[a-zA-Z\s&',.-]+$"
                      title="Please enter a valid office name"
                      value={officeDetail.office_name}
                      name="office_id"
                      onChange={(e) => {
                        setOfficeDetail((pre) => {
                          return { ...pre, office_name: e.target.value };
                        });
                      }}
                      // required
                    />
                  </InputGroup>
                  
                </Flex>
                <Flex
                  className="edit_inputs_wrap"
                  px="0px"
                  justify="space-between"
                  mb="20px"
                  align="center"
                >
                  <InputGroup flex={1} className="inpu_n_cstm">
                    <InputLeftElement pointerEvents="none">
                      <img className="location" src={location} alt="" />
                    </InputLeftElement>
                    <input
                      placeholder="Enter Postcode"
                      disabled={!isChecked}
                      name="street_address"
                      className="tsk_loc_inp form-control"
                      type="textarea"
                      value={street_address}
                      onChange={handleStreetChange}
                      onFocus={handlePopupOpen}
                      onClick={handlePopupOpen}
                      ref={searchBoxRefStreet}
                    />
                    {showPopup && (
                      <div className="map-popup">
                        <GoogleMap onLoad={onMapLoadStreet}></GoogleMap>
                      </div>
                    )}
                    {/* <Autocomplete
                        pattern="^(?!\s*$).+$"
                        title="Please enter a value without white spaces at the start"
                        className="addr_custom_inp pdng_s"
                        disabled={!isChecked}
                        Value={officeDetail?.address?.complete_address}
                        apiKey={"AIzaSyApYpgGb1pLhudPj9EBdMxd8tArd0nGp5M"}
                        onPlaceSelected={(place) => {
                          handleAddress(place);
                        }}
                        required
                      /> */}
                  </InputGroup>
                  <InputGroup flex={0.3}>
                    <InputLeftElement pointerEvents="none">
                      <img className="location" src={location} alt="" />
                    </InputLeftElement>
                    <Input
                      pattern="^(?!\s)[\s\S]*$"
                      title="Please enter a value without white spaces at the start"
                      disabled={!isChecked}
                      value={officeDetail?.address?.pincode}
                      onChange={(e) =>
                        setOfficeDetail({
                          ...officeDetail,
                          address: {
                            ...officeDetail.address,
                            pincode: e.target.value,
                          },
                        })
                      }
                      // required
                    />
                  </InputGroup>

                  <div className="select_wrapper loc_inp" flex={0.4}>
                    <img className="location-icon" src={location} alt="" />
                    <Input
                      className="icon_left_side"
                      value={officeDetail?.address?.city}
                      disabled
                    />
                  </div>

                  <div className="select_wrapper loc_inp" flex={0.4}>
                    <img className="location-icon " src={location} alt="" />
                    <Input
                      className="icon_left_side"
                      value={officeDetail?.address?.country}
                      disabled
                    />
                  </div>
                </Flex>
                <Flex
                  className="edit_inputs_wrap"
                  px="0px"
                  justify="space-between"
                  align="center"
                >
                  <div className="numb_wrap">
                    <input
                      type="number"
                      className="numb_anthr_inp"
                      disabled={!isChecked}
                      pattern="^[0-9]{6,15}$"
                      title="Please enter a valid mobile number"
                      name="phone"
                      value={officeDetail?.phone}
                      onChange={(e) => {
                        setOfficeDetail((pre) => {
                          return { ...pre, phone: e.target.value };
                        });
                      }}
                      // required
                    />

                    <PhoneInput
                      autoComplete="off"
                      className="f_1 cntry_code ofc_phn_wrp"
                      international
                      defaultCountry="United Kingdom"
                      disabled={!isChecked}
                      value={value}
                      name="country_code"
                      onChange={(e) =>
                        setOfficeDetail((previousValue) => {
                          return { ...previousValue, country_code: e };
                        })
                      }
                      // required
                    />
                  </div>

                  <InputGroup flex={1}>
                    <InputLeftElement pointerEvents="none">
                      <img src={Emailicon} alt="" />
                    </InputLeftElement>
                    <Input
                      disabled={!isChecked}
                      value={officeDetail?.email}
                      name="email"
                      pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                      title="Please enter a valid email address"
                      onChange={(e) => {
                        setOfficeDetail((pre) => {
                          return { ...pre, email: e.target.value };
                        });
                      }}
                      isRequired
                    />
                  </InputGroup>
                  <InputGroup flex={1}>
                    <InputLeftElement pointerEvents="none">
                      <img src={Globe} alt="" />
                    </InputLeftElement>
                    <Input
                      disabled={!isChecked}
                      value={officeDetail?.website}
                      name="website"
                      pattern="^(https?:\/\/)?(www\.)[a-zA-Z0-9]+([-.][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}([\/\w\.-]*)*\/?$"
                      title="Please enter a valid website URL"
                      onChange={(e) => {
                        setOfficeDetail((pre) => {
                          return { ...pre, website: e.target.value };
                        });
                      }}
                      isRequired
                    />
                  </InputGroup>
                </Flex>
              </div>
              {/* <Flex
                                justify="space-between"
                                mt="25px"
                                mb="0px"
                                flexDirection="column"
                                align="start"
                            >
                                <div className="check_wrap check_wrapper">
                                    <Checkbox
                                        colorScheme="brandScheme"
                                        me="10px"
                                        checked={isChecked}
                                        isDisabled={profile?.subadmin_rights?.viewRightOnly && !profile?.subadmin_rights?.onboardEmployess || profile?.role !=="admin"}
                                        onChange={handleCheckboxChange}
                                    />
                                    <span>Onboard another office</span>
                                </div>
                            </Flex>
                            <Flex justify="center" mt="20px" align="center">
                                <Button
                                    className="admin_dtl_save"
                                    type="submit"
                                    disabled={!isChecked}
                                >
                                    Save
                                </Button>
                            </Flex> */}
            </div>
          </form>

          <form onSubmit={Edit}>
            <div className="brd_wrap">
              <Flex justify="space-between" mb="25px" align="center">
                <Text
                  color={textColor}
                  fontSize="22px"
                  fontWeight="700"
                  lineHeight="100%"
                  fontFamily={"AirbnbBold"}
                >
                  Edit employee details
                </Text>
              </Flex>
              <Flex gap="25px" mb="" align="start">
                <div className="dtl_wrap admn_details">
                  <Flex
                    className="edit_inputs_wrap"
                    justify="space-between"
                    mb="20px"
                    align="start"
                  >
                    <InputGroup flex={1}>
                      <InputLeftElement pointerEvents="none">
                        <img src={hopper} alt="" />
                      </InputLeftElement>
                      <Input
                        placeholder="Enter full name *"
                        value={profile?.name}
                        // disabled
                        onChange={(e)=> setProfile((prev)=> ({
                          ...prev,
                          name: e.target.value
                        }))}
                      />
                    </InputGroup>
                    <InputGroup flex={1}>
                      <InputLeftElement pointerEvents="none">
                        <img src={chair} alt="" />
                      </InputLeftElement>
                      <div className="select_wrapper w-slct ">
                        {/* <img className="location-icon " src={chair} alt="" /> */}
                        <Select
                          className="icon_left_side w_100"
                          placeholder="Select designation *"
                          value={profile?.designation_id}
                          isDisabled={true}
                          onChange={(e) => {
                            setProfile((pre) => {
                              return { ...pre, designation_id: e.target.value };
                            });
                          }}
                          isRequired
                        >
                          {designation &&
                            designation.map((curr, index) => {
                              return (
                                <option key={index} value={curr._id}>
                                  {curr.name}
                                </option>
                              );
                            })}
                        </Select>
                      </div>
                    </InputGroup>
                    <div className="select_wrapper w-slct">
                      <img className="location-icon " src={chair} alt="" />
                      <Select
                        className="icon_left_side"
                        placeholder="Select department *"
                        value={profile?.department_id}
                        isDisabled={true}
                        onChange={(e) => {
                          setProfile((pre) => {
                            return { ...pre, department_id: e.target.value };
                          });
                        }}
                        isRequired
                      >
                        {department &&
                          department.map((curr, index) => {
                            return (
                              <option key={index} value={curr._id}>
                                {curr.name}
                              </option>
                            );
                          })}
                      </Select>
                    </div>
                  </Flex>
                  <Flex
                    className="edit_inputs_wrap"
                    justify="start"
                    mb="20px"
                    align="start "
                  >
                    <InputGroup flex={1}>
                      <InputLeftElement pointerEvents="none">
                        <img src={Emailicon} alt="" />
                      </InputLeftElement>
                      <Input
                        placeholder="Official email id *"
                        pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                        title="Please enter a valid email address"
                        value={profile?.email}
                        onChange={(e)=> setProfile((prev)=> ({
                          ...prev,
                          email: e.target.value
                        }))}
                        // disabled
                      />
                    </InputGroup>
                    <div className="numb_wrap f_1 emp_numb">
                      <input
                        placeholder="Mobile Number*"
                        type="text"
                        className="numb_anthr_inp"
                        name="phone"
                        pattern="^[0-9]{6,15}$"
                        title="Please enter a valid mobile number"
                        value={profile?.phone}
                        disabled
                      />
                      <PhoneInput
                        autoComplete="off"
                        className="f_1 cntry_code"
                        international
                        id="phone"
                        // required
                        // defaultCountry="RU"
                        value={profile?.country_code}
                        onChange={(e)=> console.log("Country Code", e)}
                        disabled
                      />
                    </div>

                    <div className="select_wrapper w-slct spc_select">
                      <img src={chair} className="location-icon" alt="" />
                      <Select
                          className="icon_left_side"
                          placeholder="Select office name  *"
                          value={profile?.office_id}
                          isDisabled={true}

                          onChange={(e) => {
                            setProfile((pre) => {
                              return { ...pre, office_id: e.target.value };
                            });
                          }}
                          isRequired
                        >
                          {officeName &&
                            officeName.map((curr, index) => {
                              return (
                                <option key={index} value={curr._id}>
                                  {curr.office_name}
                                </option>
                              );
                            })}
                        </Select>
                    </div>
                  </Flex>
                  <Flex
                    className="edit_inputs_wrap"
                    justify="start"
                    mb="25px"
                    align="center"
                  >
                    <InputGroup
                      flex={1}
                      maxW="255px"
                      className="chkra_password_grp"
                    >
                      <InputLeftElement pointerEvents="none">
                        <img src={lock} alt="" />
                      </InputLeftElement>
                      <Input
                        type={passwordShown === true ? "text" : "password"}
                        placeholder="Choose password"
                        className="chkra_inpu_pass"
                        name="password"
                        autoComplete="new-password"
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$"
                        title="Password must contain at least 8 characters including one uppercase letter, one lowercase letter, one digit, and one special character"
                        value={editAbleProfile?.password}
                        // isDisabled={
                        //   profile?.subadmin_rights?.viewRightOnly &&
                        //   !profile?.subadmin_rights?.onboardEmployess
                        // }
                        onChange={(e) => {
                          setEditableProfile((pre) => {
                            return { ...pre, password: e.target.value };
                          });
                        }}
                        // isRequired
                      />
                      <InputRightElement
                        onClick={() => togglePasswordVisiblity()}
                      >
                        <img src={eye} alt="" />
                      </InputRightElement>
                    </InputGroup>
                    <InputGroup
                      flex={1}
                      maxW="255px"
                      className="chkra_password_grp"
                    >
                      <InputLeftElement pointerEvents="none">
                        <img src={lock} alt="" />
                      </InputLeftElement>
                      <Input
                        type={confirmPasswordShown ? "text" : "password"}
                        placeholder="Confirm password"
                        className="chkra_inpu_pass"
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$"
                        title="Password must contain at least 8 characters including one uppercase letter, one lowercase letter, one digit, and one special character"
                        name="confirmPassword"
                        // isDisabled={
                        //   profile?.subadmin_rights?.viewRightOnly &&
                        //   !profile?.subadmin_rights?.onboardEmployess
                        // }
                        autoComplete="off"
                        value={editAbleProfile?.confirmPassword}
                        onChange={(e) => {
                          setEditableProfile((pre) => {
                            return { ...pre, confirmPassword: e.target.value };
                          });
                        }}
                        // isRequired
                      />
                      {!passwordsMatch && <div>Passwords do not match</div>}
                      <InputRightElement>
                        <img
                          src={eye}
                          alt=""
                          onClick={toggleConfirmPasswordVisiblity}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </Flex>
                </div>
                <div className="dtl_wrap_img">
                  <div className="Admin_img" align="center">
                    <div className="edit_img_curr">
                      <input
                        type="file"
                        id="admin_img_curr"
                        name="profile_image"
                        value={
                          editAbleProfile?.profile_image[0] &&
                          editAbleProfile?.profile_image[0]
                        }
                        disabled={
                          profile?.subadmin_rights?.viewRightOnly &&
                          !profile?.subadmin_rights?.onboardEmployess
                        }
                        isRequired
                        onChange={handleImage}
                        accept="image/*"
                        // required
                      />
                      {
                        <img
                          src={
                            imagePreview ||
                            `https://uat-presshope.s3.eu-west-2.amazonaws.com/public/adminImages/${profile?.profile_image}`
                          }
                          className="uploaded_img nimg"
                          alt="Preview"
                        />
                      }
                    </div>
                  </div>
                </div>
              </Flex>
            </div>

            <div className="brd_wrap pd_in pdng_tp new_emp_prsn_dtl">
              <Flex justify="space-between" mb="25px" mt="25px" align="center">
                <Text
                  color={textColor}
                  fontSize="22px"
                  fontWeight="700"
                  lineHeight="100%"
                  fontFamily={"AirbnbBold"}
                >
                  Edit employee personal details
                </Text>
              </Flex>
              <div className="dtl_wrap">
                <Flex
                  className="edit_inputs_wrap"
                  px="0px"
                  justify="space-between"
                  mb="20px"
                  align="center"
                >
                  <InputGroup flex={1}>
                    <InputLeftElement pointerEvents="none">
                      <img className="location" src={location} alt="" />
                    </InputLeftElement>
                    <Autocomplete
                      // pattern="^(?!\s)[\s\S]*$"
                      title="Please enter a value without white spaces at the start"
                      className="addr_custom_inp"
                      apiKey={"AIzaSyApYpgGb1pLhudPj9EBdMxd8tArd0nGp5M"}
                      disabled={
                        profile?.subadmin_rights?.viewRightOnly &&
                        !profile?.subadmin_rights?.onboardEmployess
                      }
                      onPlaceSelected={(place) => {
                        handleEmployeeAddress(place);
                      }}
                      // required
                    />
                  </InputGroup>
                  <InputGroup flex={0.3}>
                    <InputLeftElement pointerEvents="none">
                      <img className="location" src={location} alt="" />
                    </InputLeftElement>
                    <Input
                      placeholder="Post code"
                      className="disabled"
                      pattern="^(?!\s)[\s\S]*$"
                      title="Please enter a value without white spaces at the start"
                      value={employeeDetail?.employee_address?.post_code || profile?.employee_address?.post_code}
                      disabled={
                        profile?.subadmin_rights?.viewRightOnly &&
                        !profile?.subadmin_rights?.onboardEmployess
                      }
                      onChange={(e) =>
                        setEmployeeDetail((prevState) => ({
                          ...prevState,
                          employee_address: {
                            ...prevState.employee_address,
                            post_code: e.target.value,
                          },
                        }))
                      }
                      // required
                    />
                  </InputGroup>

                  <div className="select_wrapper" flex={0.4}>
                    <img className="location-icon " src={location} alt="" />
                    <Input
                      placeholder="City"
                      className="icon_left_side no_dsbl"
                      value={employeeDetail?.employee_address?.city ||  profile?.employee_address?.city}
                      // disabled
                    />
                  </div>

                  <div className="select_wrapper" flex={0.4}>
                    <img className="location-icon " src={location} alt="" />
                    <Input
                      placeholder="Country"
                      className="icon_left_side no_dsbl"
                      value={employeeDetail?.employee_address?.country || profile?.employee_address?.country}
                      // disabled
                    />
                  </div>
                </Flex>
                <Flex
                  className="edit_inputs_wrap"
                  px="0px"
                  justify="space-between"
                  align="center"
                >
                  <InputGroup flex={1}>
                    <InputLeftElement>
                      <img src={useric} alt="" />
                    </InputLeftElement>
                    <Input
                      placeholder="Enter bank holder name"
                      value={profile?.bank_details?.account_holder_name}
                      pattern="^(?! )[a-zA-Z\s'-]+$"
                      title="Please enter a valid bank holder name"
                      disabled={
                        profile?.subadmin_rights?.viewRightOnly &&
                        !profile?.subadmin_rights?.onboardEmployess
                      }
                      onChange={(e) =>
                        setEmployeeDetail((prevState) => ({
                          ...prevState,
                          bank_details: {
                            ...prevState.bank_details,
                            account_holder_name: e.target.value,
                          },
                        }))
                      }
                      // required
                    />
                  </InputGroup>
                  <InputGroup flex={1}>
                    <InputLeftElement>
                      <img src={bankic} alt="" />
                    </InputLeftElement>
                    <Input
                      placeholder="Enter bank name"
                      pattern="^(?!^\s)(?!.*\s$)[a-zA-Z0-9\s]+$"
                      title="Please enter a valid bank name without white spaces at the start or end"
                      value={profile?.bank_details?.bank_name}
                      disabled={
                        profile?.subadmin_rights?.viewRightOnly &&
                        !profile?.subadmin_rights?.onboardEmployess
                      }
                      onChange={(e) =>
                        setEmployeeDetail((prevState) => ({
                          ...prevState,
                          bank_details: {
                            ...prevState.bank_details,
                            bank_name: e.target.value,
                          },
                        }))
                      }
                      // required
                    />
                  </InputGroup>
                  <InputGroup flex={0.7}>
                    <InputLeftElement>
                      <img src={sortcodeic} alt="" />
                    </InputLeftElement>
                    <Input
                      placeholder="Enter sort code"
                      // pattern="^(?!^\s)(?!.*\s$)[a-zA-Z0-9\s]+$"
                      // pattern="^[0-9]{2}-[0-9]{2}-[0-9]{2}$"
                      title="please enter valid sort code"
                      value={profile?.bank_details?.sort_code}
                      disabled={
                        profile?.subadmin_rights?.viewRightOnly &&
                        !profile?.subadmin_rights?.onboardEmployess
                      }
                      onChange={(e) =>
                        setEmployeeDetail((prevState) => ({
                          ...prevState,
                          bank_details: {
                            ...prevState.bank_details,
                            sort_code: e.target.value,
                          },
                        }))
                      }
                      // required
                    />
                  </InputGroup>
                  <InputGroup flex={1}>
                    <InputLeftElement>
                      <img src={accountic} alt="" />
                    </InputLeftElement>
                    <Input
                      placeholder="Enter account number"
                      pattern="^[a-zA-Z0-9]+$"
                      title="Please enter a valid account number"
                      value={profile?.bank_details?.account_number}
                      disabled={
                        profile?.subadmin_rights?.viewRightOnly &&
                        !profile?.subadmin_rights?.onboardEmployess
                      }
                      onChange={(e) =>
                        setEmployeeDetail((prevState) => ({
                          ...prevState,
                          bank_details: {
                            ...prevState.bank_details,
                            account_number: e.target.value,
                          },
                        }))
                      }
                      // required
                    />
                  </InputGroup>
                </Flex>
              </div>
            </div>

            {/*  New Employee Rights*/}
            {/* {profile?.subadmin_rights?.assignNewEmployeeRights &&
                            <div className="pdng_tp">
                                <Flex justify="space-between" mb="25px" align="center">
                                    <Text
                                        color={textColor}
                                        fontSize="22px"
                                        fontWeight="700"
                                        lineHeight="100%"
                                        fontFamily={"AirbnbBold"}
                                    >
                                        New employee rights
                                    </Text>
                                </Flex>
                                <Flex
                                    className="rights_check_wrap"
                                    justify="space-between"
                                    mb="20px"
                                    align="start"
                                >
                                    <div className="check_wrap check_wrapper rights_check">
                                        <Checkbox
                                            colorScheme="brandScheme"
                                            me="10px"
                                            name="subadmin_rights.onboardEmployess"
                                            isChecked={profile?.subadmin_rights?.onboardEmployess}
                                            onChange={(e) =>
                                                setEmployeeDetail({
                                                    ...employeeDetail,
                                                    subadmin_rights: {
                                                        ...employeeDetail.subadmin_rights,
                                                        onboardEmployess: e.target.checked,
                                                    },
                                                })
                                            }
                                        />
                                        <span>Allowed to onboard employees</span>
                                    </div>
                                    <div className="check_wrap check_wrapper rights_check">
                                        <Checkbox
                                            colorScheme="brandScheme"
                                            me="10px"
                                            name="subadmin_rights.blockRemoveEmployess"
                                            isChecked={profile?.subadmin_rights?.blockRemoveEmployess}
                                            onChange={(e) =>
                                                setEmployeeDetail({
                                                    ...employeeDetail,
                                                    subadmin_rights: {
                                                        ...employeeDetail.subadmin_rights,
                                                        blockRemoveEmployess: e.target.checked,
                                                    },
                                                })
                                            }
                                        />
                                        <span>Allowed to block/remove employees </span>
                                    </div>
                                    <div className="check_wrap check_wrapper rights_check">
                                        <Checkbox
                                            colorScheme="brandScheme"
                                            me="10px"
                                            name="subadmin_rights.assignNewEmployeeRights"
                                            isChecked={profile?.subadmin_rights?.assignNewEmployeeRights
                                            }
                                            onChange={(e) =>
                                                setEmployeeDetail({
                                                    ...employeeDetail,
                                                    subadmin_rights: {
                                                        ...employeeDetail.subadmin_rights,
                                                        assignNewEmployeeRights: e.target.checked,
                                                    },
                                                })
                                            }
                                        />
                                        <span>Allowed to assign new employee rights</span>
                                    </div>
                                    <div className="check_wrap check_wrapper rights_check">
                                        <Checkbox
                                            colorScheme="brandScheme"
                                            me="10px"
                                            name="subadmin_rights.completeAccess"

                                            isChecked={profile?.subadmin_rights?.completeAccess}

                                            onChange={(e) =>
                                                setEmployeeDetail({
                                                    ...employeeDetail,
                                                    subadmin_rights: {
                                                        ...employeeDetail?.subadmin_rights,
                                                        completeAccess: e.target.checked,
                                                        onboardEmployess: e.target.checked,
                                                        controlHopper: e.target.checked,
                                                        controlPublication: e.target.checked,
                                                        controlContent: e.target.checked,
                                                        assignNewEmployeeRights: e.target.checked,
                                                        blockRemoveEmployess: e.target.checked,
                                                        viewRightOnly: e.target.checked,
                                                        other_rights: e.target.checked
                                                    },
                                                })
                                            }
                                        />
                                        <span>Allowed admin rights</span>
                                    </div>
                                </Flex>
                                <Flex
                                    className="rights_check_wrap"
                                    justify="space-between"
                                    mb="20px"
                                    align="start">
                                    <div className="check_wrap check_wrapper rights_check">
                                        <Checkbox
                                            colorScheme="brandScheme"
                                            me="10px"
                                            name="subadmin_rights.controlHopper"
                                            isChecked={profile?.subadmin_rights?.controlHopper}
                                            onChange={(e) =>
                                                setEmployeeDetail({
                                                    ...employeeDetail,
                                                    subadmin_rights: {
                                                        ...employeeDetail.subadmin_rights,
                                                        controlHopper: e.target.checked,
                                                    },
                                                })
                                            }
                                        />
                                        <span>Allowed to control Hoppers</span>
                                    </div>
                                    <div className="check_wrap check_wrapper rights_check">
                                        <Checkbox
                                            colorScheme="brandScheme"
                                            me="10px"
                                            name="subadmin_rights.controlPublication
                    "
                                            isChecked={profile?.subadmin_rights?.controlPublication}
                                            onChange={(e) =>
                                                setEmployeeDetail({
                                                    ...employeeDetail,
                                                    subadmin_rights: {
                                                        ...employeeDetail.subadmin_rights,
                                                        controlPublication: e.target.checked,
                                                    },
                                                })
                                            }
                                        />
                                        <span>Allowed to control Publications </span>
                                    </div>
                                    <div className="check_wrap check_wrapper rights_check">
                                        <Checkbox
                                            colorScheme="brandScheme"
                                            me="10px"
                                            name="subadmin_rights.controlContent
                    "
                                            isChecked={profile?.subadmin_rights?.controlContent}
                                            onChange={(e) =>
                                                setEmployeeDetail({
                                                    ...employeeDetail,
                                                    subadmin_rights: {
                                                        ...employeeDetail.subadmin_rights,
                                                        controlContent: e.target.checked,
                                                    },
                                                })
                                            }
                                        />
                                        <span>Allowed to control Content </span>
                                    </div>
                                    <div className="check_wrap check_wrapper rights_check">
                                        <Checkbox
                                            colorScheme="brandScheme"
                                            me="10px"
                                            name="subadmin_rights.viewRightOnly
                    "
                                            isChecked={profile?.subadmin_rights?.viewRightOnly}
                                            onChange={(e) =>
                                                setEmployeeDetail({
                                                    ...employeeDetail,
                                                    subadmin_rights: {
                                                        ...employeeDetail.subadmin_rights,
                                                        viewRightOnly: e.target.checked,
                                                    },
                                                })
                                            }
                                        />
                                        <span>Viewing rights only</span>
                                    </div>
                                </Flex>
                                <Flex
                                    className="rights_check_wrap"
                                    justify="space-between"
                                    mb="20px"
                                    align="start">
                                    <div className="check_wrap check_wrapper rights_check">
                                        <Checkbox
                                            colorScheme="brandScheme"
                                            me="10px"
                                            name="subadmin_rights.other_rights"
                                            isChecked={profile?.subadmin_rights?.completeAccess}
                                            onChange={(e) =>
                                                setEmployeeDetail({
                                                    ...employeeDetail,
                                                    subadmin_rights: {
                                                        ...employeeDetail.subadmin_rights,
                                                        other_rights: e.target.checked,
                                                    },
                                                })
                                            }
                                        />
                                        <span>Allowed product master editing</span>
                                    </div>

                                </Flex>
                            </div>} */}
            <Flex justify="center" mb="20px" align="center">
              <Button className="admin_dtl_save" type="onsubmit">
                Save
              </Button>
            </Flex>
          </form>
        </Container>
      </Card>
    </Box>
    </>
  );
}
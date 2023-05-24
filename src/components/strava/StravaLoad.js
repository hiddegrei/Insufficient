import React, { useState, useEffect } from "react";
import "../../css/StravaLoad.css";
import { useStateValue } from "../../Stateprovider";
import { Avatar, IconButton } from "@material-ui/core";
import { db } from "../../firebase";
import EditIcon from "@material-ui/icons/Edit";
import { Link, useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import Post from "../post/Post";
import firebase from "firebase";
import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

import StravaRecord from "./StravaRecord";

function StravaLoad() {
  const { pName } = useParams();
  const history = useHistory();

  const [{ user, profile, handle }, dispatch] = useStateValue();

  const [stravaData, setStravaData] = useState([]);
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState({})
  const [index1,setIndex1]=useState(0)
  const [page, setPage] = useState(1);
  const [start, setStart] = useState(false);
  const [loaded, setLoaded] = useState(0);
  const [reload, setReload] = useState(false);
  const [inQue, setInQue] = useState(0);

  const [testData, setTestData] = useState([
    {
      resource_state: 2,
      athlete: {
        id: 7927461,
        resource_state: 1,
      },
      name: "Evening Ride",
      distance: 71809.4,
      moving_time: 7041,
      elapsed_time: 7314,
      total_elevation_gain: 76,
      type: "Ride",
      sport_type: "Ride",
      workout_type: null,
      id: 9127124136,
      start_date: "2023-05-23T16:11:19Z",
      start_date_local: "2023-05-23T18:11:19Z",
      timezone: "(GMT+01:00) Europe/Amsterdam",
      utc_offset: 7200,
      location_city: null,
      location_state: null,
      location_country: "Belgium",
      achievement_count: 0,
      kudos_count: 28,
      comment_count: 0,
      athlete_count: 4,
      photo_count: 0,
      map: {
        id: "a9127124136",
        summary_polyline:
          "{vdyHsfoTHeCSyCcCcJq@kESeJJe@hAoAWyKeEcVqMk[_C_LUO}E~B]McGsd@cD{Rc@qHUaSb@}BxCiH`BkRIkHuA{Os@eCeAyAiBuJOgEwAsDcEwT_@yR{BiSmDaVeAo[i@eFuA_HaG{J_GmM}DsSeEcMmDsCiC{E}BmGmB}HkBsC@aBx@kA~B?V{@?mBMeAYWoCa@?mBwAeCe@iFXcIi@yEaBuFqEcI{FaOiHiMmBaBZsCOy@uFmBwDiCcOyMmA}CsBDqW_UmJoGsfBkzAir@sYyAmBgFkNkAsAaGuCqI`D{JnHcBHyAaAy@cG{AaD_B}@mG_@iGyHsAk@{Tk@kCvAwBzIiDdJaErBuArB_Dr^wJpX{AlBoG|ByAxBwF`W_JjUoAjNcAh@cJc@aCpAmDvFgJ|XsEpIwA`@gAfAyF_GeAB}ArL{FnS}@EcFwDgb@uTcE_EiHuLuAmAWmEqBaIiLyn@{CqTwBwYM_qAj@aTrBsPxBkVDcNlBu@z@cI|@xA~Bt@lMuBdGyB|H{F`HmBx@y@NmCcEohA`Cqp@\\eD|RsVDkAk@cC_CoEh@yF~HgFH}FX{AKaBnAoBdC_HzQun@dLq[bFaLn`@ecAnZwi@pNmq@[{Bcr@moB{@qAa@aKuDw]}GsVu@}GuAs_A\\iFrA_DrQsTtSqr@vM_[`BqGpAqAqJ}kBuKuqAIsKz@}iAZeAnOwIfOoApHeFjD}E|o@{XlJqB`BDbn@iRvEk@tU^~@l@^~B~@fBo@fnAqBfAmYjGcEvA{@x@e@dCwBjk@iCvN{GfsB{@|FNzFOxGkFh~Ad@~FzD`Jb@fCfErk@RxHa@`EeAtDqKjQyAvDkA~IwCn]lDbmCvVpmApBzDdr@~`AnDjCtg@bRj\\p_@bBpAdh@|KzBjBrAnDb@lDdEprA?jG_ApCmKhJ_AhBmDl[kNnz@WzEbA~x@St@sC|@yIdF[\\Ep@|El^j@bBjARvGeCfMpK~UtAfRtKZr@[jCa@nMBnNgAfPjBvG~Mt^`A`AvCYdCdJvBjg@c@|C}C`JjDjHjAnFxBpg@~BlT~CnQxDzNRjEnJ|^z@rBeCnDa@zMlApAfAtDl@tKpFze@bExLxBdMlAlErI|QfD`FrAhH`@rDrAt]dDtTxB~Rb@lSfErTnAdDTbF~AtIhArB|@tDhAxMPbHsBpS{CbH]jEVdPj@hIlB|M`EhV`@dHq@fIy@dC{C`FGdBp@dEl@`BjGdLpJ|KxBpFn@hUj@|JGnL",
        resource_state: 2,
      },
      trainer: false,
      commute: false,
      manual: false,
      private: false,
      visibility: "everyone",
      flagged: false,
      gear_id: null,
      start_latlng: [51.48, 3.52],
      end_latlng: [51.48, 3.53],
      average_speed: 10.199,
      max_speed: 16.668,
      average_cadence: 86.5,
      average_temp: 11,
      average_watts: 251.2,
      max_watts: 729,
      weighted_average_watts: 269,
      kilojoules: 1768.4,
      device_watts: true,
      has_heartrate: true,
      average_heartrate: 148.5,
      max_heartrate: 178,
      heartrate_opt_out: false,
      display_hide_heartrate_option: true,
      elev_high: 7.3,
      elev_low: -2.8,
      upload_id: 9790986864,
      upload_id_str: "9790986864",
      external_id: "garmin_ping_275782159910",
      from_accepted_tag: false,
      pr_count: 0,
      total_photo_count: 0,
      has_kudoed: false,
      suffer_score: 189,
    },
    {
      resource_state: 2,
      athlete: {
        id: 7927461,
        resource_state: 1,
      },
      name: "Lunch Ride",
      distance: 112842,
      moving_time: 13015,
      elapsed_time: 13176,
      total_elevation_gain: 126.9,
      type: "Ride",
      sport_type: "Ride",
      workout_type: null,
      id: 9113187197,
      start_date: "2023-05-21T10:01:27Z",
      start_date_local: "2023-05-21T12:01:27Z",
      timezone: "(GMT+01:00) Europe/Amsterdam",
      utc_offset: 7200,
      location_city: null,
      location_state: null,
      location_country: "Belgium",
      achievement_count: 3,
      kudos_count: 22,
      comment_count: 0,
      athlete_count: 1,
      photo_count: 0,
      map: {
        id: "a9113187197",
        summary_polyline:
          "yleyHcdoTv@}O{MbIqC|DsR~HoP~C{EtWC~ZkEjIwRlPeSlKgNpMsUnf@uFeJ{H{AqAfLtAd_@vV~a@qBzG_AnMh@dRuJ`QaKvX_B~JuUbo@gDnD{BdN}HxOw@tEkHvI_IzUoHvJ{HtCyBqBcHtAyHbTgAlNuRvJyBja@aDfB}SKwq@cMgIoEqDkFsc@kaBiJik@ob@efAiQyy@qKs`@gImVQeCjBoG}DkQ_@sIx@cDjLiI?mAqHsOoF}FqL`GeAiAoF}j@oLql@|DeWa@alApNmm@nA}N{Aeh@gMmTiEkVxE}l@{FwE{M`AmVkn@qPoFsMgPeHqEw@iR|Ce\\gEsF_IogAfCue@}RnCEaIiG}OYwDn@sV|Eoa@bBi@tObHjFkY~CB_NiKgLeQwQmdAkFem@C_qApGgw@HkOjBw@~@cIhErCnM{Bz[cQ}DikA|Cav@jc@si@BsKqAuWlTms@|q@qfBjZci@lNsp@iLc_@?oCs@J{e@_sA}Egk@uGuTq@aIk@keAnSkYlVcw@zPwb@_JkhBmLkwAfAcvAbPgJhNy@~NwMbm@qW|z@gUt_@cAxAn@xAlEi@doAkd@hMeDlo@qCrPuGfoBeAzJeF~mBf@jGfDdJaGiHeA~@jEn|@sLnqAlDxkCpWvoAtt@jeAlm@|Vp^da@fl@hOlCnJpErvAsAjG{LzMyCnYqNxz@^lbAkWrMcf@`PsM`UyaBeFqAtImPq@yC|DkCiBsDjN_BpBV|LiEpIw@hK`G|HxJpBjDtMc@~L{Hlr@[~d@r@dQ}CvPdDhVvJn@r@|Dg@lHoEKeF`De^k@[xhA~Bhy@~j@qOhAuF^tCcBjJDrGs[wCaw@~ZqSwMi^mx@kV}OaXyb@uDq@yLaJsg@qY}FYuEvDmBbL@tNoEba@e@bVfH`TPfIhRkCeCpc@|HzjAdE~D}Cz[zAdd@|HnqAwAnc@`Bfc@`ChF`@lRbBhHlA_@bWkYvQoJrI@zHrJdNPfAbUSvRqO~r@W|qAqCrRtKfj@rMtnAxKc@c@jFd@|FbEzPoBrHn@nEhGvOfEbTlG`Q~P`y@ha@bcAnJxk@bd@nbBvI`J`s@lNzXBxAkCx@NhBo^zRsIz@kPvGeRjH{AlKY~HgH~IwXfCo@~DeHv@mFtG_MnCsO|C_ExNi^zFqQjAwIfLs[`JcOm@oR|@}MlBkGoW_e@u@c`@nAwHpHlBhG`J~Rkb@rEkG|]eUtToShC{GCeXfF}Xrb@sMzPwM",
        resource_state: 2,
      },
      trainer: false,
      commute: false,
      manual: false,
      private: false,
      visibility: "everyone",
      flagged: false,
      gear_id: null,
      start_latlng: [51.48, 3.52],
      end_latlng: [51.48, 3.53],
      average_speed: 8.67,
      max_speed: 15.657,
      average_temp: 17,
      average_watts: 158,
      kilojoules: 2056,
      device_watts: false,
      has_heartrate: true,
      average_heartrate: 125.5,
      max_heartrate: 164,
      heartrate_opt_out: false,
      display_hide_heartrate_option: true,
      elev_high: 13.1,
      elev_low: -1.4,
      upload_id: 9775926485,
      upload_id_str: "9775926485",
      external_id: "garmin_ping_275406354552",
      from_accepted_tag: false,
      pr_count: 1,
      total_photo_count: 0,
      has_kudoed: false,
      suffer_score: 82,
    },
    {
      resource_state: 2,
      athlete: {
        id: 7927461,
        resource_state: 1,
      },
      name: "Evening Run",
      distance: 11988.7,
      moving_time: 3319,
      elapsed_time: 3319,
      total_elevation_gain: 87,
      type: "Run",
      sport_type: "Run",
      workout_type: null,
      id: 9108401324,
      start_date: "2023-05-20T17:56:07Z",
      start_date_local: "2023-05-20T19:56:07Z",
      timezone: "(GMT+01:00) Europe/Amsterdam",
      utc_offset: 7200,
      location_city: null,
      location_state: null,
      location_country: "Belgium",
      achievement_count: 0,
      kudos_count: 13,
      comment_count: 0,
      athlete_count: 1,
      photo_count: 0,
      map: {
        id: "a9108401324",
        summary_polyline:
          "}deyHwboTVQ^KhBAtCo@pC]JZVzA^jBJLVHDA^a@x@m@ZHJLH\\L|B`@bDJXJJTLZF`AQnFkD|BQvA_@DCj@kA\\ETb@LDLEdAkAVIrBwBt@e@lAg@~A}@\\AVLV~@BVMLi@Tq@tA]\\k@Zo@r@iAf@Uf@cAt@_@dAKRU@YLaAj@WXc@\\SD]Tm@`AwArAa@v@MLc@Rm@H{@CUFa@b@S^g@xAq@lA?PJR~@dA`@l@HXBTCNYj@Sp@KtAG\\Qb@WXoBlBg@n@mBvAm@p@c@^_ErCoFdEcB|@mAzAi@PyA|@oAfAQXOBSLaFhEy@b@_BhAeB`B_BdAu@VCPf@bBLd@BZEz@M|@GLkD~CY^Q`@wAbA}AzAqBxBmCfCeBfB]d@yBpBcBjAmBxBC@SI@Pk@bAkAxAoB~AcAn@GLs@x@{CtCoAr@URORw@bBkCpD{DvHmAhCOTQd@S~@k@rAUx@s@zAw@fAIj@?v@Kr@wAnCoBdEq@~AIVKl@KV]j@e@p@O`@G^Yl@Yb@aA\\sAIu@Qq@Ya@UIKk@FIAGITeIZoDCcAEc@O{@e@gB?cALgDAeBJcE\\uFRqAFS`@{@rBkCnAiBZq@b@iBZ_AlAs@pC}B`@e@jBoCn@s@dBgAxB]LI~@yA~A}ApAg@dAgAVOr@Wb@IZg@p@yBNw@J}@@cAC}ARu@Zk@\\a@hBIXOd@_Av@{BhAuDHc@^cA^q@Vs@Vy@b@cA^iDDq@jAkBXo@t@}@h@aAV_AHaAb@_@RYLGtASr@Ud@YC]FeBQs@Dm@b@a@^S\\a@`@QXw@FGj@Ul@]d@k@`@Wn@k@`@Id@SxA{@d@KHHPBZk@d@yBTc@`@[fH}D~As@h@e@NCx@e@v@m@V[BGDy@BEd@a@l@MD?|@n@h@A`AFdASP@`@WhAF|AK`A_@Lc@Ve@FNBv@?dBHpAFDL?NEd@k@j@a@h@e@vDsBVIHN?l@OdEDhBRbANXZT`@x@@FKXWf@QTMH_Bj@iEtBk@j@y@rAcAdAi@`@{Ad@eB~@k@h@qBp@aAd@u@JYXwA~@IBMGM}AAgC@aBEoD@sBSwGD_@x@{BBUScHUoF@kANeAn@oBJK`APZ?vCY",
        resource_state: 2,
      },
      trainer: false,
      commute: false,
      manual: false,
      private: false,
      visibility: "everyone",
      flagged: false,
      gear_id: null,
      start_latlng: [51.48, 3.52],
      end_latlng: [51.48, 3.52],
      average_speed: 3.612,
      max_speed: 5.058,
      average_cadence: 82.8,
      average_temp: 25,
      has_heartrate: true,
      average_heartrate: 152.2,
      max_heartrate: 174,
      heartrate_opt_out: false,
      display_hide_heartrate_option: true,
      elev_high: 30.2,
      elev_low: 0.1,
      upload_id: 9770824655,
      upload_id_str: "9770824655",
      external_id: "garmin_ping_275253749164",
      from_accepted_tag: false,
      pr_count: 0,
      total_photo_count: 0,
      has_kudoed: false,
      suffer_score: 104,
    },
    {
      resource_state: 2,
      athlete: {
        id: 7927461,
        resource_state: 1,
      },
      name: "Lunch Ride",
      distance: 92757.7,
      moving_time: 10801,
      elapsed_time: 10987,
      total_elevation_gain: 166,
      type: "Ride",
      sport_type: "Ride",
      workout_type: null,
      id: 9106194923,
      start_date: "2023-05-20T10:08:19Z",
      start_date_local: "2023-05-20T12:08:19Z",
      timezone: "(GMT+01:00) Europe/Amsterdam",
      utc_offset: 7200,
      location_city: null,
      location_state: null,
      location_country: "Belgium",
      achievement_count: 0,
      kudos_count: 21,
      comment_count: 0,
      athlete_count: 1,
      photo_count: 0,
      map: {
        id: "a9106194923",
        summary_polyline:
          "{leyH_doT~@aGGaHwM|HqC~DmRzHoPzCgAzB}CpSCl[sEdJuR|OgSlKmMpLuMnZqGvKcGoJoHgAmA|J^|Wd@xE~AnEhT~\\qBxF_AbNt@`PS`BkI~MgLl[aAjImNj`@aH`PwB~AoDhSqG~K}@pEyCtFcCrAsB`EiAhGiC`H{ApCcHtG}ACyCrBuBuBgHdBuHjSgAtOqRpIFnCyBb\\s@|A{Bn@sUYeq@}L{H_FcEaHiFkVq[eiAeJwj@kZss@gHaTyOkv@cGePuDwRqGaQg@sDdBmEB{BuDoOc@sIdAiErKgHR{AmHoOoFuFgLnF}Aw@kF_l@gKmd@a@gFTmEhDsPg@kJ@u`AhMaj@hB{NIkPy@yYqMmUcEkTCwGnDm]LmHuF}DsMr@sUim@}Q_GmM}P}EeBy@{Ao@gSfHsr@`Eco@bOKu@\\mLeDH{L_@mAeWgF~@qOa@sAgR~CAkH_HmRZqXzFqd@lAK~ObHhFoYzC?sLsIgMqQUiEyPm|@eCwQuBu[IcpAh@sQlFug@BiNlB_A`AeI|@rAxCv@`MuBlGaCvHwFxGgBx@mAyDilAbDcv@hc@ui@EyKiBoSZmBjUsu@hp@obBf[ck@fNup@kAcGmr@koBSiIsD}]}HgZe@uL{@yx@ZkEjAoCfQaUlWuy@xJkTtCeJkKesBuJ{hAv@yyAdPkJhNy@nIyFzDkFxn@gXzMmBvk@qQfH}@dUZpAv@T|B~@pAc@|mAy]lJgFjC}Czo@eCbN}GrrB_AtG@nOeF~|A\\hHpD|IU\\gAmCgDcDcAv@rEv|@_MzpAbD~jCpW~pAru@nfArCxB~f@pQv`@vb@tf@hKtDvCbBvHtEpuAI`Do@rBuKnKaArBeDd[uNj{@l@~_AoWvMgf@bPoJxRkA~@{hA{EoIl@qMu@k@~CnBh@e@jCmLT{F_AyCzDcCwBoDzMgBbCXlMmEvHaAfKtGpIxFZtBlAjAvBfBnIq@dOwHzo@Ypf@r@lPoClKMjDbD`VlB|@bGO`Az@F~Am@zIeFGqE|CqEiAsW\\g@teA`Cz{@vSoGpVwFr@kADwCn@XeB|MH~Fw@jFh@`FrBhDzADpAjDfI|e@lOde@jJnTpNd|@dE|_@r@xJZdLdDtLqFpFWdDnZvjAxM|UrI~\\`Uzr@pa@~i@`EvTtAfUFbQnGpLfMpa@vNt]bDxFtKfGn@MtAgFjGzAlFnJp@DdGyKxKgWxD_F~IwHlReKlTgRxC}G^{I]sNjDaUz@yB|PiDlReIjC}DlJ}F",
        resource_state: 2,
      },
      trainer: false,
      commute: false,
      manual: false,
      private: false,
      visibility: "everyone",
      flagged: false,
      gear_id: null,
      start_latlng: [51.48, 3.52],
      end_latlng: [51.48, 3.53],
      average_speed: 8.588,
      max_speed: 13.644,
      average_cadence: 75.4,
      average_temp: 19,
      average_watts: 195.7,
      max_watts: 643,
      weighted_average_watts: 201,
      kilojoules: 2113.4,
      device_watts: true,
      has_heartrate: true,
      average_heartrate: 123.6,
      max_heartrate: 155,
      heartrate_opt_out: false,
      display_hide_heartrate_option: true,
      elev_high: 35.8,
      elev_low: 14.2,
      upload_id: 9768487355,
      upload_id_str: "9768487355",
      external_id: "garmin_ping_275197449234",
      from_accepted_tag: false,
      pr_count: 0,
      total_photo_count: 0,
      has_kudoed: false,
      suffer_score: 63,
    },
    {
      resource_state: 2,
      athlete: {
        id: 7927461,
        resource_state: 1,
      },
      name: "Lunch Ride",
      distance: 92551.7,
      moving_time: 10533,
      elapsed_time: 10664,
      total_elevation_gain: 152,
      type: "Ride",
      sport_type: "Ride",
      workout_type: null,
      id: 9099958598,
      start_date: "2023-05-19T09:42:22Z",
      start_date_local: "2023-05-19T11:42:22Z",
      timezone: "(GMT+01:00) Europe/Amsterdam",
      utc_offset: 7200,
      location_city: null,
      location_state: null,
      location_country: "Belgium",
      achievement_count: 0,
      kudos_count: 18,
      comment_count: 0,
      athlete_count: 1,
      photo_count: 0,
      map: {
        id: "a9099958598",
        summary_polyline:
          "{leyH_doTx@oF@uHoMzH{CdEqR`IoP|CkAfDyCdSZpOYlIsEzIyRlPiRzJsHpGeFfGkL~WiGnKaGyJsH{@kAjK^fWj@lF~AhE`T`]gBbFmA|Nt@zOQ~AkFlHkDrIuI~UkA|J_Thj@iBnG{BxBmDpPiGzKaArFiD|FqBd@eCjFiEdOwAfCkEvE_Er@kClBaBmBcEPqBzByHtS[~Io@fCsR~IwBx`@{BdBwUEir@qMsGmDkE_GsG_YwZsfAuJil@y^}|@cGgSyL{n@cGiP{DyRiGwP_@sDdBqEFkB_EqOg@uFPuDh@gBrLeI@cA}H}OsEmFyLhFoAaAiGal@oJsc@e@uER{EjDqQg@oJ@w_AbNcm@vA}RyAc[AiJaMoSeE_U@_HpE}d@yFwE_KlAwBk@cUyl@kQmG{McQgGiD{@}SxCmZiE{EaIgjArCib@{@{@cQzCEmHeGoOe@cE^_UxFae@jBStOtH|EsY~CBqMoJoLeQMsDoDaOoKsl@gCqQwBs\\CmqAh@uOjFmg@BqNrBaA|@gIh@pA|CdAjMwBdQsJpIeDwD{lAvCeu@vc@kj@E{JkBwT`@eCvTys@jp@mcBt[yk@fNsp@KcB}N{b@sd@woAUeI}Dg`@iH}Ve@yGcAi_A^mEvSiYzUav@dQcc@sJckBwKorA~@ixAhPmJlN{@nIyFtCmEhq@mYvBKrAlNnEq@b@kAWwJ`@{A|k@gQfFu@hVZ|@d@b@rCz@~@g@~nAs[tHkHhD}Cpo@kC`OyGjrB_AzGB|MkFz~A\\lGtDjJaB}BuCsC{@CUt@fEl|@wLvpAhDtkCpWppApu@dfAzC|Bxg@dRv_@`b@~f@nKnDvC~AfHpExvAk@lF}MzNkDl[wNd|@b@x_AaV~Log@vPmJrRuAdAehAyE_Jh@gMq@i@h@CzBrBd@_@lCeMLeFeAmDdE}B_CkAdGkExIXrM_EzGkA~KnGlIrJjBxDxLSjIqIrv@c@vd@l@xQeCzJQtDjCzT|BbBfGKdAz@HzAo@bJ{EIyEbDsEiAkWBi@jfA~B|{@vTuGjUeFz@{A?kCl@TaBdMHlGy@rFh@~EzBpDpACvAzDvHdd@xOrf@nJxTrNf|@hEt`@l@xI\\fLdDlLmFrF]hDjZhjA`N|VjIh\\fU`s@l^zd@~AdDfE`VnAhSHrQfGbLxLx`@zSve@tL`Hj@QrAaF`GxAtFjJp@BnVyf@~LoLzRkKrIuGxIiJxCaH\\iI]qO~CkSbAuChPyCxRgIpCaEtJcG",
        resource_state: 2,
      },
      trainer: false,
      commute: false,
      manual: false,
      private: false,
      visibility: "everyone",
      flagged: false,
      gear_id: null,
      start_latlng: [51.48, 3.52],
      end_latlng: [51.48, 3.53],
      average_speed: 8.787,
      max_speed: 12.177,
      average_cadence: 77.2,
      average_temp: 17,
      average_watts: 205.8,
      max_watts: 667,
      weighted_average_watts: 215,
      kilojoules: 2167.8,
      device_watts: true,
      has_heartrate: true,
      average_heartrate: 130.1,
      max_heartrate: 156,
      heartrate_opt_out: false,
      display_hide_heartrate_option: true,
      elev_high: 16.6,
      elev_low: 0.8,
      upload_id: 9761884451,
      upload_id_str: "9761884451",
      external_id: "garmin_ping_275010042624",
      from_accepted_tag: false,
      pr_count: 0,
      total_photo_count: 0,
      has_kudoed: false,
      suffer_score: 98,
    },
  ]);

  const [min1Rec, setMin1Rec] = useState([
    { value: 0, id: 0 },
    { value: 0, id: 0 },
    { value: 0, id: 0 },
    { value: 0, id: 0 },
    { value: 0, id: 0 },
  ]);
  const [min2Rec, setMin2Rec] = useState([
    { value: 0, id: 0 },
    { value: 0, id: 0 },
    { value: 0, id: 0 },
    { value: 0, id: 0 },
    { value: 0, id: 0 },
  ]);
  const [min5Rec, setMin5Rec] = useState([
    { value: 0, id: 0 },
    { value: 0, id: 0 },
    { value: 0, id: 0 },
    { value: 0, id: 0 },
    { value: 0, id: 0 },
  ]);
  const [min10Rec, setMin10Rec] = useState([
    { value: 0, id: 0 },
    { value: 0, id: 0 },
    { value: 0, id: 0 },
    { value: 0, id: 0 },
    { value: 0, id: 0 },
  ]);
  const [min20Rec, setMin20Rec] = useState([
    { value: 0, id: 0 },
    { value: 0, id: 0 },
    { value: 0, id: 0 },
    { value: 0, id: 0 },
    { value: 0, id: 0 },
  ]);

  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show5, setShow5] = useState(false);
  const [show10, setShow10] = useState(false);
  const [show20, setShow20] = useState(false);

  useEffect(() => {
    if (profile?.username != undefined) {
      db.collection("users")
        .doc(profile?.username)
        .collection("records")
        .doc("min1")
        .get()
        .then((doc) => {
          
          if (doc.exists) {
            
            setMin1Rec(doc.data().peaks);
          }
        });
      db.collection("users")
        .doc(profile?.username)
        .collection("records")
        .doc("min2")
        .get()
        .then((doc) => {
         
          if (doc.exists) {
           
            setMin2Rec(doc.data().peaks);
          }
        });
      db.collection("users")
        .doc(profile?.username)
        .collection("records")
        .doc("min5")
        .get()
        .then((doc) => {
         
          if (doc.exists) {
           
            setMin5Rec(doc.data().peaks);
          }
        });
      db.collection("users")
        .doc(profile?.username)
        .collection("records")
        .doc("min10")
        .get()
        .then((doc) => {
          
          if (doc.exists) {
           
            setMin10Rec(doc.data().peaks);
          }
        });
      db.collection("users")
        .doc(profile?.username)
        .collection("records")
        .doc("min20")
        .get()
        .then((doc) => {
         
          if (doc.exists) {
            
            setMin20Rec(doc.data().peaks);
          }
        });
    }
  }, [profile]);

  useEffect(() => {
    if (start) {
      // fetch(`https://us-central1-ms-strava.cloudfunctions.net/app/api/users/${profile?.username}/activities/${page}`,
      //   {
      //     method: "GET", // or 'PUT'
      //     headers: {
      //       "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",

      //     }
      //   }
      // )
      //   .then((res) => res.json())
      //   .then((json) => {
      //     console.log(json.data);

      //     if(json.data.message==undefined){
      //       console.log('hi')
      //       setInQue(json.data.length)
      //       setStravaData(json.data);

      //       startLoading(json.data)

      //     }

      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
      
      setInQue(testData.length);
      setStravaData(testData);
      // startLoading(testData);
      // setLoading(true)
    }
  }, [start, page]);

  useEffect(() => {
    // if(loaded>=inQue&&inQue!=0){
    //     console.log("hi")
    //     setPage(page+1)
    //     setLoaded(0)
    //     setInQue(0)
    // }
  }, [loaded, reload]);

  useEffect(()=>{
    if(stravaData.length>0){
      setLoading(true)
    }
  },[stravaData])

  async function startLoading(data) {
    let loaded1 = 0;
    for (let i = 0; i < data.length; i++) {
      let result = await handleStravaClick(data[i].id);
      await calcEverything(result.json,result.id);
     

      loaded1++;
    }
    setLoaded(loaded1);
  }

  useEffect(()=>{
    if(loading){
      if(index1<stravaData.length){
        let result =handleStravaClick(stravaData[index1].id);

      }
     
      
      // console.log(result)
      // calcEverything(result.json,result.id);


    }
  },[index1,loading])

  useEffect(()=>{
    if(JSON.stringify(result) != "{}"){
      console.log(result)
      calcEverything(result.json,result.id)

    }
    
  },[result])

  useEffect(()=>{
          setIndex1(index1+1)
  },[min1Rec])

  async function handleStravaClick(id) {
    return new Promise((resolve) => {
   db.collection("users")
      .doc(profile?.username)
      .collection("activities")
      .doc(`${id}`)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          fetch(
            `https://us-central1-ms-strava.cloudfunctions.net/app/api/users/${profile?.username}/activities/${id}/streams`,
            {
              method: "GET", // or 'PUT'
              headers: {
                "Content-Type":
                  "application/x-www-form-urlencoded;charset=UTF-8",
              },
            }
          )
            .then((res) => res.json())
            .then((json) => {
              let result
              if (JSON.stringify(json) != "{}") {
                setResult({json:json,id:id})
               resolve({json:json,id:id})
              } else {
                console.log("hi");
              }
             
            }
            )
            
        }
      })
    })
  }
  async function calcRec(oneMin, id, arr) {
    let newOneMinRec = [...arr];
    for (let i = 0; i < 5; i++) {
      // if(id===newOneMinRec[i].id){
      //   break;
      // }
     
      if (oneMin >= newOneMinRec[i].value) {
        console.log(oneMin,newOneMinRec[i].value)
        // for (let j = i; j < 5; j++) {
        //   if (j + 1 < 5) {
        //     newOneMinRec[j + 1].value = arr[j].value;
        //     newOneMinRec[j + 1].id = arr[j].id;
        //   }
        // }
        newOneMinRec.splice(i, 0, {id:id,value:oneMin});
        // newOneMinRec[i].value = oneMin;
        // newOneMinRec[i].id = id;
        newOneMinRec.pop()

        break;
      }
    }
    return newOneMinRec;
  }
  async function calcEverything(json, idd) {
    if (json.data.watts != undefined) {
      let oneMin = await calc1min(json.data.watts.data);
      let twoMin = await calc2min(json.data.watts.data);
      let min5 = await calc5min(json.data.watts.data);
      let min10 = await calc10min(json.data.watts.data);
      let min20 = await calc20min(json.data.watts.data);

      let newOneArr = await calcRec(oneMin, idd, min1Rec);
      let newTwoArr = await calcRec(twoMin, idd, min2Rec);
      let new5Arr = await calcRec(min5, idd, min5Rec);
      let new10Arr = await calcRec(min10, idd, min10Rec);
      let new20Arr = await calcRec(min20, idd, min20Rec);

      setMin1Rec(newOneArr);
      setMin2Rec(newTwoArr);
      setMin5Rec(new5Arr);
      setMin10Rec(new10Arr);
      setMin20Rec(new20Arr);

      db.collection("users")
        .doc(profile?.username)
        .collection("records")
        .doc("min1")
        .set({ peaks: newOneArr });
      db.collection("users")
        .doc(profile?.username)
        .collection("records")
        .doc("min2")
        .set({ peaks: newTwoArr });
      db.collection("users")
        .doc(profile?.username)
        .collection("records")
        .doc("min5")
        .set({ peaks: new5Arr });
      db.collection("users")
        .doc(profile?.username)
        .collection("records")
        .doc("min10")
        .set({ peaks: new10Arr });
      db.collection("users")
        .doc(profile?.username)
        .collection("records")
        .doc("min20")
        .set({ peaks: new20Arr });

      db.collection("users")
        .doc(profile?.username)
        .collection("activities")
        .doc(`${idd}`)
        .set({
          oneMin: oneMin,
          twoMin: twoMin,
          min5: min5,
          min10: min10,
          min20: min20,
        })
        .then((doc) => {
          console.log("added to database");
        });
    }else{
      setIndex1(index1+1)
    }
  }

  async function calc1min(watts) {
    let record = 0;
    for (let i = 0; i < watts.length; i++) {
      let temp = 0;
      for (let j = i; j < i + 60; j++) {
        temp += watts[j];
      }
      if (temp / 60 > record) {
        record = temp / 60;
      }
    }
    return Math.round(record);
  }
  async function calc2min(watts) {
    let record = 0;
    for (let i = 0; i < watts.length; i++) {
      let temp = 0;
      let theEnd = watts.length - i;
      if (theEnd >= 120) {
        for (let j = i; j < i + 120; j++) {
          temp += watts[j];
        }
        if (temp / 120 > record) {
          record = temp / 120;
        }
      }
    }
    return Math.round(record);
  }
  async function calc5min(watts) {
    let record = 0;
    for (let i = 0; i < watts.length; i++) {
      let temp = 0;
      let theEnd = watts.length - i;
      if (theEnd >= 300) {
        for (let j = i; j < i + 300; j++) {
          temp += watts[j];
        }
        if (temp / 300 > record) {
          record = temp / 300;
        }
      }
    }
    return Math.round(record);
  }
  async function calc10min(watts) {
    let record = 0;
    for (let i = 0; i < watts.length; i++) {
      let temp = 0;
      let theEnd = watts.length - i;
      if (theEnd >= 600) {
        for (let j = i; j < i + 600; j++) {
          temp += watts[j];
        }
        if (temp / 600 > record) {
          record = temp / 600;
        }
      }
    }
    return Math.round(record);
  }
  async function calc20min(watts) {
    let record = 0;
    for (let i = 0; i < watts.length; i++) {
      let temp = 0;
      let theEnd = watts.length - i;
      if (theEnd >= 1200) {
        for (let j = i; j < i + 1200; j++) {
          temp += watts[j];
        }
        if (temp / 1200 > record) {
          record = temp / 1200;
        }
      }
    }
    return Math.round(record);
  }

  return (
    <div style={{ width: "100%", alignContent: "center" }}>
      <div
        style={{ border: "1px solid black" }}
        onClick={() => setStart(!start)}
      >
        {start ? "started" : "not started"}
      </div>

      <div>{page}</div>

      <div>
        loaded: {loaded}/{inQue}
      </div>

      <div onClick={() => setReload(!reload)}>reload</div>

      <div></div>
      <div></div>
      <div className="records">
        <StravaRecord data={min1Rec} name="1min" />
        <StravaRecord data={min2Rec} name="2min" />
        <StravaRecord data={min5Rec} name="5min" />
        <StravaRecord data={min10Rec} name="10min" />
        <StravaRecord data={min20Rec} name="20min" />
      </div>
    </div>
  );
}

export default StravaLoad;

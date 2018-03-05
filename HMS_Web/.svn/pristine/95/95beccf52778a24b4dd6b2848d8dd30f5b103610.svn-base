package com.skt.hms;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;


import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping(value = { "/" })
public class ViewController {


	@RequestMapping(value = { "" }, method = RequestMethod.GET)
	public String hello() {
		return "index";
	}

	@RequestMapping(value = { "/hms" }, method = RequestMethod.GET)
	public String viewMain() {
		return "/apps/app";
	}

	@RequestMapping(value = { "/common-directive" }, method = RequestMethod.GET)
	public String viewCommonDirective() {
		return "/apps/sample/common-directive";
	}


	/**
     * 메인 화면
     * @return
     */
    @RequestMapping(value = { "/main-info" }, method = RequestMethod.GET)
	public String viewMainInfo() {
		return "/apps/main/main-info";
	}
    
    /**
     * Node 상세 정보 Popup
     * @return
     */
    @RequestMapping(value = { "/node-detail-info" }, method = RequestMethod.GET)
	public String viewNodeDetailInfo() {
		return "/apps/popup/node-detail-info";
	}
    
    /**
     * group 관리 화면
     * @return
     */
    @RequestMapping(value = { "/group-mgmt-info" }, method = RequestMethod.GET)
	public String viewGroupMgmtInfo() {
		return "/apps/group/group-mgmt-info";
	}
    
    /**
     * Node Status 정보 Popup
     * @return
     */
    @RequestMapping(value = { "/node-status-info" }, method = RequestMethod.GET)
	public String viewNodeStatusInfo() {
		return "/apps/popup/node-status-info";
	}
    
    /**
     * plugin 관리 화면
     * @return
     */
    @RequestMapping(value = { "/plugin-mgmt-info" }, method = RequestMethod.GET)
	public String viewPluginMgmtInfo() {
		return "/apps/plugin/plugin-mgmt-info";
	}
    
    /**
     * task 관리 화면
     * @return
     */
    @RequestMapping(value = { "/task-mgmt-info" }, method = RequestMethod.GET)
	public String viewTaskMgmtInfo() {
		return "/apps/task/task-mgmt-info";
	}
    
    /**
     * agent status 화면
     * @return
     */
    @RequestMapping(value = { "/agent-status-info" }, method = RequestMethod.GET)
	public String viewAgentStatusInfo() {
		return "/apps/agent/agent-status-info";
	}
    
    
    /**
     * plugin Popup
     * @return
     */
    @RequestMapping(value = { "/plugin-popup-info" }, method = RequestMethod.GET)
	public String viewPluginPopupInfo() {
		return "/apps/popup/plugin-popup-info";
	}
    
    /**
     * task Popup
     * @return
     */
    @RequestMapping(value = { "/task-popup-info" }, method = RequestMethod.GET)
	public String viewTaskPopupInfo() {
		return "/apps/popup/task-popup-info";
	}
    
    /**
     * node Popup
     * @return
     */
    @RequestMapping(value = { "/node-popup-info" }, method = RequestMethod.GET)
	public String viewNodePopupInfo() {
		return "/apps/popup/node-popup-info";
	}
    
    /**
     * sample rest api
     * @return
     */
    @RequestMapping(value = { "/test-info" }, method = RequestMethod.GET)
	public String viewSampleRestInfo() {
		return "/apps/sample/test-info";
	}
    
    /**
     * group add Popup
     * @return
     */
    @RequestMapping(value = { "/group-add-popup" }, method = RequestMethod.GET)
	public String viewGroupAddPopup() {
		return "/apps/popup/group-add-popup";
	}
    
    /**
     * group delete Popup
     * @return
     */
    @RequestMapping(value = { "/group-del-popup" }, method = RequestMethod.GET)
	public String viewGroupDelPopup() {
		return "/apps/popup/group-del-popup";
	}
    
    /**
     * change 관리 화면
     * @return
     */
    @RequestMapping(value = { "/change-mgmt-info" }, method = RequestMethod.GET)
	public String viewChangeMgmtInfo() {
		return "/apps/change/change-mgmt-info";
	}
    
    /**
     * change hold 관리 화면
     * @return
     */
    @RequestMapping(value = { "/change-hold-info" }, method = RequestMethod.GET)
	public String viewChangeHoldMgmtInfo() {
		return "/apps/change/change-hold-info";
	}
    
    /**
     * Compare 정보 Popup
     * @return
     */
    @RequestMapping(value = { "/compare-popup-info" }, method = RequestMethod.GET)
	public String viewComparePopupInfo() {
		return "/apps/popup/compare-popup-info";
	}
    
    
    /**
     * Plugin 파일업로드 Popup
     * @return
     */
    @RequestMapping(value = { "/fileUpload-popup" }, method = RequestMethod.GET)
	public String viewFileUploadPopup() {
		return "/apps/popup/fileUpload-popup";
	}
    
    
    /**
     * Node history 상세 정보 Popup
     * @return
     */
    @RequestMapping(value = { "/node-history-detail-info" }, method = RequestMethod.GET)
	public String viewNodeHistoryDetailInfo() {
		return "/apps/popup/node-history-detail-info";
	}
    
    /**
     * Task Status Per Node 상세 정보 Popup
     * @return
     */
    @RequestMapping(value = { "/task-status-node-info" }, method = RequestMethod.GET)
	public String viewTaskStatusNodeInfo() {
		return "/apps/popup/task-status-node-info";
	}
    
    /**
     * Node Trash Bin 정보 Popup
     * @return
     */
    @RequestMapping(value = { "/trashBin-popup-info" }, method = RequestMethod.GET)
	public String viewTrashBinPopupInfo() {
		return "/apps/popup/trashBin-popup-info";
	}
}

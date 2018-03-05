package com.skt.hms.common;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.skt.hms.common.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skt.hms.user.AuthService;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@Service
public class CommonService {

	@Autowired
	private CommonMapper commonMapper;

	@Autowired
	private AuthService authService;


	/**
	 * 데이터센터 리스트 조회
	 */
	public List<DatacenterModel> getDatacenterList(DatacenterModel datacenterModel) throws Exception {
//		UserModel userModel = (UserModel) authService.getUser();
//		if (userModel != null && (Object)userModel.getDefaultDatacenter() != null){
//			String defaultDataCenterId = ((Object)userModel.getDefaultDatacenter()).toString();
//			datacenterModel.setDatacenterId(defaultDataCenterId);
//		}
		List<DatacenterModel> datacenterModelList = commonMapper.getDatacenterList(datacenterModel);
		return datacenterModelList;
	}

	/**
	 * 리소스 정보 조회
	 * 데이터센터, 층, 방, 랙, 하드웨어
	 */
	public DatacenterModel getResourceTree(DatacenterModel datacenterModel) throws Exception {
		DatacenterModel resultMode = commonMapper.getResourceTree(datacenterModel);
		return resultMode;
	}

	/**
	 * 룸 ORD 갱신
	 */
	public void updateRoomOrd(RoomModel roomModel) throws Exception {
		commonMapper.updateRoomOrd(roomModel);
	}

	/**
	 * 룸 섹션 리스트 조회 - 타일 정보
	 */
	public List<RoomSectionModel> getRoomSectionList(RoomSectionModel roomSectionModel) throws Exception {
		List<RoomSectionModel> resultList = commonMapper.getRoomSectionList(roomSectionModel);
		return resultList;
	}

	/**
	 * 룸 섹션 리스트 추가 - 타일 정보
	 */
	public void setRoomSection(RoomSectionModel roomSectionModel) throws Exception {
		commonMapper.setRoomSection(roomSectionModel);
	}

	/**
	 * 룸 섹션 리스트 삭제 - 타일 정보
	 */
	public void deleteRoomSection(RoomSectionModel roomSectionModel) throws Exception {
		commonMapper.deleteRoomSection(roomSectionModel);
	}


	/**
	 * 하드웨어 상태 코드 리스트 조회
	 */
	public List<HardwareTypeModel> getHardwareTypeList() throws Exception {
		List<HardwareTypeModel> resultModel = commonMapper.getHardwareTypeList();
		return resultModel;
	}


	/**
	 * 하드웨어 리스트 조회
	 */
	public List<HardwareModel> getHardwareList(RackModel rackModel) throws Exception {
		List<HardwareModel> resultList = commonMapper.getHardwareList(rackModel);
		return resultList;
	}

	/**
	 * 하드웨어 정보 조회
	 */
	public HardwareModel getHardwareInfoByHardwareCommonId(HardwareModel hardwareModel) throws Exception {
		HardwareModel resultModel = commonMapper.getHardwareInfoByHardwareCommonId(hardwareModel);

		List<HardwareStaffModel> hardwareStaff = commonMapper.getHardwareStaff(hardwareModel);
		resultModel.setHardwareStaffModel(hardwareStaff);
		return resultModel;
	}


	/**
	 * 하드웨어 정보 삭제 후 삽입
	 * tb_hw_hardware_additory
	 */
	public RackModel setHardwareAdditory(RackModel rackModel) throws Exception {
		commonMapper.delHardwareAdditoryByRackId(rackModel);

		List<HardwareModel> list = rackModel.getChildren();

		if (list != null && list.size() > 0){
			HashMap<String, List<HardwareModel>> param = new HashMap<>();
			param.put("list", list);
			commonMapper.setHardwareAdditory(param);
		}
		return rackModel;

	}



	/**
	 * 특정 랙 정보 조회
	 */
	public RackModel getRackInfoById(RackModel rackModel) throws Exception {
		RackModel resultModel = commonMapper.getRackInfoById(rackModel);
		return resultModel;
	}


	/**
	 * 상면도 정보 저장
	 */
	public SaveInfoModel setSaveInfo(SaveInfoModel saveInfoModel) throws Exception {

		if (saveInfoModel.getVersion() == null) return null;

		if (saveInfoModel.getVersion().toLowerCase().equals("release-temp")) {
			commonMapper.setSaveInfo(saveInfoModel);
		} else if (saveInfoModel.getVersion().toLowerCase().equals("release")){
			// TB_DC_ROOM_SECTION_INFO 에 저장 처리
		}

		return saveInfoModel;
	}

	/**
	 * 상면도 정보 조회
	 */
	public List<SaveInfoModel> getSaveInfoModel(SaveInfoModel saveInfoModel) throws Exception {
		List<SaveInfoModel> returnList = commonMapper.getSaveInfoList(saveInfoModel);
		return returnList;
	}


	/**
	 * 상면도 다이어그램 정보 저장
	 */
	public DiagramInfoModel setDiagramInfo(DiagramInfoModel diagramInfoModel) throws Exception {
		String version = diagramInfoModel.getVersion();
		if (version != null && (version.equals("release") || version.equals("review"))){	// 저장 또는 업데이트 처리
			List<DiagramInfoModel> diagramInfoModelList = getDiagramInfoList(diagramInfoModel);
			if (diagramInfoModelList.size() > 0) {	// 업데이트 처리
				diagramInfoModel.setDiagramInfoId(diagramInfoModelList.get(0).getDiagramInfoId());
				commonMapper.updateDiagramInfo(diagramInfoModel);
			} else {
				commonMapper.setDiagramInfo(diagramInfoModel);
			}
		} else {
			commonMapper.setDiagramInfo(diagramInfoModel);
		}

		return diagramInfoModel;
	}


	/**
	 * 상면도 다이어그램 정보 조회
	 */
	public List<DiagramInfoModel> getDiagramInfoList(DiagramInfoModel diagramInfoModel) throws Exception {
		List<DiagramInfoModel> returnList = commonMapper.getDiagramInfoList(diagramInfoModel);
		return returnList;
	}


	public List<SaveInfoModel> getSaveDiagramInfoList(SaveInfoModel saveInfoModel) throws Exception {
		List<SaveInfoModel> returnModel = commonMapper.getSaveDiagramInfoList(saveInfoModel);
		return returnModel;
	}

	/**
	 * 미지정 장비 리스트 조회
	 */
	public List<Object> getUnspecifiedInfoList(SaveInfoModel saveInfoModel) throws Exception {
		if (saveInfoModel.getType() == null) return null;

		List<Object> returnList = null;
		saveInfoModel.setType(saveInfoModel.getType().toLowerCase());
		if (saveInfoModel.getType().equals("room")){
			returnList = commonMapper.getUnspecifiedInfoListForRoom(saveInfoModel);
		} else if (saveInfoModel.getType().equals("rack")){
			returnList = commonMapper.getUnspecifiedInfoListForRack(saveInfoModel);
		}

		return returnList;
	}


	/**
	 * Rack 그리기 모델 리스트 조회
	 */
	public List<RackDrawModel> getRackDrawModelList(RackModel rackModel) throws Exception {
		List<RackDrawModel> returnList = commonMapper.getRackDrawModelList(rackModel);
		return returnList;
	}

	/**
	 * DataCetner-Floor-Room
	 */
	private void makeDataCenterTree(List<DataCenterTreeModel> result, List<DataCenterTreeModel> list, DataCenterTreeModel parent) {
		for (int i=0; i < list.size(); i++) {
			DataCenterTreeModel t = list.get(i);
			if (t.getParent().equals(parent.getResourceSeq())) {
				if (parent.getChildren() == null) {
					parent.setChildren(new ArrayList<DataCenterTreeModel>());
				}
				
				parent.getChildren().add(t);
				
				result.add(t);
				makeDataCenterTree(result, list, t);
			}
		}		
	}
	public List<DataCenterTreeModel> getDataCenterTree() throws Exception {
		List<DataCenterTreeModel> list = commonMapper.getDatacenterTree();
		List<DataCenterTreeModel> result = new ArrayList<DataCenterTreeModel> ();
		for (int i=0; i < list.size(); i++) {
			DataCenterTreeModel t = list.get(i);
			
			result.add(t);
			makeDataCenterTree(result, list, t);
		}
		return result;
	}
}

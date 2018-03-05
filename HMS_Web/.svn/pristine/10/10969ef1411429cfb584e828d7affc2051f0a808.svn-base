package com.skt.hms.common;

import com.skt.hms.common.model.*;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;




@Repository("CommonMapper")
public interface CommonMapper {

	/**
	 * 데이터센터 리스트 조회
	 */
	public List<DatacenterModel> getDatacenterList(DatacenterModel datacenterModel) throws Exception;


	/**
	 * 층 리스트 조회
	 */
	public List<FloorModel> getFloorList(DatacenterModel datacenterModel) throws Exception;

	/**
	 * 방 리스트 조회
	 */
	public List<RoomModel> getRoomList(FloorModel floorModel) throws Exception;

	/**
	 * 방 ORD 갱신
	 */
	public void updateRoomOrd(RoomModel roomModel) throws Exception;


	/**
	 * 방 섹션 리스트 조회 - 타일 정보
	 */
	public List<RoomSectionModel> getRoomSectionList(RoomSectionModel roomSectionModel) throws Exception;

	/**
	 * 방 섹션 리스트 추가 - 타일 정보
	 */
	public void setRoomSection(RoomSectionModel roomSectionModel) throws Exception;

	/**
	 * 방 섹션 리스트 삭제 - 타일 정보
	 */
	public void deleteRoomSection(RoomSectionModel roomSectionModel) throws Exception;


	/**
	 * 랙 리스트 조회
	 */
	public List<RackModel> getRackList(RoomModel roomModel) throws Exception;


	/**
	 * 특정 랙 정보 조회
	 */
	public RackModel getRackInfoById(RackModel rackModel) throws Exception;


	/**
	 * 하드웨어 리스트 조회
	 */
	public List<HardwareModel> getHardwareList(RackModel rackModel) throws Exception;


	/**
	 * 하드웨어 상태 코드 리스트 조회
	 */
	public List<HardwareTypeModel> getHardwareTypeList() throws Exception;


	/**
	 * 하드웨어 정보 조회
	 */
	public HardwareModel getHardwareInfoByHardwareCommonId(HardwareModel hardwareModel) throws Exception;

	/**
	 * 하드웨어 정보 삭제 - hardware_additory
	 */
	public int delHardwareAdditoryByRackId(RackModel rackModel) throws Exception;

	/**
	 * 하드웨어 정보 삽입 - hardware_additory
	 */
	public int setHardwareAdditory(HashMap<String, List<HardwareModel>> param) throws Exception;



	/**
	 * 담당자 정보 조회
	 */
	public List<HardwareStaffModel> getHardwareStaff(HardwareModel hardwareModel) throws Exception;

	/**
	 * 특정 데이터센터의 리소스 정보 조회
	 * 데이터센터, 층, 방, 랙, 하드웨어
	 */
	public DatacenterModel getResourceTree(DatacenterModel datacenterModel) throws Exception;


	/**
	 * 상면도 정보 저장
	 */
	public void setSaveInfo(SaveInfoModel saveInfoModel) throws Exception;

	/**
	 * 상면도 정보 조회
	 */
	public List<SaveInfoModel> getSaveInfoList(SaveInfoModel saveInfoModel) throws Exception;


	/**
	 * 상면도 다이어그램 정보 저장
	 */
	public void setDiagramInfo(DiagramInfoModel diagramInfoModel) throws Exception;


	/**
	 * 상면도 다이어그램 정보 조회
	 */
	public List<DiagramInfoModel> getDiagramInfoList(DiagramInfoModel diagramInfoModel) throws Exception;


	/**
	 * 상면도 다이어그램 정보 업데이트
	 */
	public void updateDiagramInfo(DiagramInfoModel diagramInfoModel) throws Exception;

	/**
	 * 상면도 저장 정보 + 다이어그램 정보 조회
	 */
	public List<SaveInfoModel> getSaveDiagramInfoList(SaveInfoModel saveInfoModel) throws Exception;


	/**
	 * 미지정 장비 리스트 조회
	 */
	public List<Object> getUnspecifiedInfoListForRoom(SaveInfoModel saveInfoModel) throws Exception;
	public List<Object> getUnspecifiedInfoListForRack(SaveInfoModel saveInfoModel) throws Exception;


	/**
	 * Rack 그리기 모델 리스트 조회
	 */
	public List<RackDrawModel> getRackDrawModelList(RackModel rackModel) throws Exception;

	/**
	 * DataCetner-Floor-Room 구조를 구성하는 리스트 조회
	 */
	public List<DataCenterTreeModel> getDatacenterTree() throws Exception;

}

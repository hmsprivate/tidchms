describe tb_user;



 user_id            bigint(20) unsigned NO   PRI NULL    auto_increment
 empno              varchar(64)         NO       NULL    
 name               varchar(50)         NO       NULL    
 real_name          varchar(50)         NO       NULL    
 password           varchar(128)        NO       NULL    
 department         varchar(255)        NO       NULL    
 phone              varchar(15)         NO       NULL    
 email              varchar(255)        NO       NULL    
 default_datacenter bigint(20) unsigned NO       NULL    
 enabled            char(1)             NO       NULL    
 create_date        date                NO       NULL    
 update_date        date                NO       NULL    
 role_id            bigint(20) unsigned NO       NULL    
 role_grade         char(1)             NO       NULL    
 affairs            varchar(255)        NO       NULL    

 
 
 insert into tb_user (            
 	  EMPNO              
	, NAME               
	, REAL_NAME          
	, PASSWORD           
	, DEPARTMENT         
	, PHONE              
	, EMAIL              
	, DEFAULT_DATACENTER 
	, APPROVED            
	, CREATE_DATE        
	, UPDATE_DATE        
	, ROLE_ID            
	, ROLE_GRADE         
	, AFFAIRS              
 ) values (
 	  '11111113'              
	, 'TAM'               
	, 'TA MANAGER'          
	, '123'           
	, 'OTHER'         
	, '010-4567-1234'              
	, 'test@abcd.com'              
	, 168 
	, '1'            
	, now()        
	, now()        
	, 3            
	, '1'         
	, 'test'   
 )
 
 select * from tb_user
 where role_id = 2 and role_grade = '1'
 
 update tb_user set role_id=4 where name='TAMGR';
 
 alter table TB_RC_REQUEST modify REQUESTER varchar(50);
 alter table TB_RC_REQUEST modify APPROVER varchar(50);
 
 select * from tb_rc_request;
 
 
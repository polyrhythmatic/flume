var MOBILE_MAX_WIDTH = 992;
var isMobile = true;
var maskContext;
var mask;
var maskVisible = false;
var animationCanvas;
var animationContext;

var masks = [];
var maskLoader = 0;

var buttonWidth;
var buttonHeight;
var buttonContext;

var lastButtonX;
var lastButtonY;

var inactivityTimeout;
var isInstrumentalPlaying = false;
var trackPlayedOnce = false;
var instrumentalInitilizer = false; //this is only used once

var glowOutlines = [];
var stage = new PIXI.Container();

var glowOutline = function(num){
	this.texture = new PIXI.Texture.fromImage('images/masks/' + (num + 1) + '.png');
	this.sprite = new PIXI.Sprite(this.texture);
	this.sprite.width = animationCanvas.width;
	this.sprite.height = animationCanvas.height;
	this.sprite.alpha = 0;
	stage.addChild(this.sprite);
	this.isFadingIn = false;
	this.isFadingOut = false;
};

glowOutline.prototype.fadeIn = function(){
	this.isFadingIn = true;
	this.isFadingOut = false;
};

glowOutline.prototype.fadeOut = function(){
	this.isFadingOut = true;
	this.isFadingIn = false;
};

var instrumental;
var sampler;
var buff;
window.onload = function(){
	var css = "text-shadow: -1px -1px hsl(0,100%,50%), 1px 1px hsl(5.4, 100%, 50%), 3px 2px hsl(10.8, 100%, 50%), 5px 3px hsl(16.2, 100%, 50%), 7px 4px hsl(21.6, 100%, 50%), 9px 5px hsl(27, 100%, 50%), 11px 6px hsl(32.4, 100%, 50%), 13px 7px hsl(37.8, 100%, 50%), 14px 8px hsl(43.2, 100%, 50%), 16px 9px hsl(48.6, 100%, 50%), 18px 10px hsl(54, 100%, 50%), 20px 11px hsl(59.4, 100%, 50%), 22px 12px hsl(64.8, 100%, 50%), 23px 13px hsl(70.2, 100%, 50%), 25px 14px hsl(75.6, 100%, 50%), 27px 15px hsl(81, 100%, 50%), 28px 16px hsl(86.4, 100%, 50%), 30px 17px hsl(91.8, 100%, 50%), 32px 18px hsl(97.2, 100%, 50%), 33px 19px hsl(102.6, 100%, 50%), 35px 20px hsl(108, 100%, 50%), 36px 21px hsl(113.4, 100%, 50%), 38px 22px hsl(118.8, 100%, 50%), 39px 23px hsl(124.2, 100%, 50%), 41px 24px hsl(129.6, 100%, 50%), 42px 25px hsl(135, 100%, 50%), 43px 26px hsl(140.4, 100%, 50%), 45px 27px hsl(145.8, 100%, 50%), 46px 28px hsl(151.2, 100%, 50%), 47px 29px hsl(156.6, 100%, 50%), 48px 30px hsl(162, 100%, 50%), 49px 31px hsl(167.4, 100%, 50%), 50px 32px hsl(172.8, 100%, 50%), 51px 33px hsl(178.2, 100%, 50%), 52px 34px hsl(183.6, 100%, 50%), 53px 35px hsl(189, 100%, 50%), 54px 36px hsl(194.4, 100%, 50%), 55px 37px hsl(199.8, 100%, 50%), 55px 38px hsl(205.2, 100%, 50%), 56px 39px hsl(210.6, 100%, 50%), 57px 40px hsl(216, 100%, 50%), 57px 41px hsl(221.4, 100%, 50%), 58px 42px hsl(226.8, 100%, 50%), 58px 43px hsl(232.2, 100%, 50%), 58px 44px hsl(237.6, 100%, 50%), 59px 45px hsl(243, 100%, 50%), 59px 46px hsl(248.4, 100%, 50%), 59px 47px hsl(253.8, 100%, 50%), 59px 48px hsl(259.2, 100%, 50%), 59px 49px hsl(264.6, 100%, 50%), 60px 50px hsl(270, 100%, 50%), 59px 51px hsl(275.4, 100%, 50%), 59px 52px hsl(280.8, 100%, 50%), 59px 53px hsl(286.2, 100%, 50%), 59px 54px hsl(291.6, 100%, 50%), 59px 55px hsl(297, 100%, 50%), 58px 56px hsl(302.4, 100%, 50%), 58px 57px hsl(307.8, 100%, 50%), 58px 58px hsl(313.2, 100%, 50%), 57px 59px hsl(318.6, 100%, 50%), 57px 60px hsl(324, 100%, 50%), 56px 61px hsl(329.4, 100%, 50%), 55px 62px hsl(334.8, 100%, 50%), 55px 63px hsl(340.2, 100%, 50%), 54px 64px hsl(345.6, 100%, 50%), 53px 65px hsl(351, 100%, 50%), 52px 66px hsl(356.4, 100%, 50%), 51px 67px hsl(361.8, 100%, 50%), 50px 68px hsl(367.2, 100%, 50%), 49px 69px hsl(372.6, 100%, 50%), 48px 70px hsl(378, 100%, 50%), 47px 71px hsl(383.4, 100%, 50%), 46px 72px hsl(388.8, 100%, 50%), 45px 73px hsl(394.2, 100%, 50%), 43px 74px hsl(399.6, 100%, 50%), 42px 75px hsl(405, 100%, 50%), 41px 76px hsl(410.4, 100%, 50%), 39px 77px hsl(415.8, 100%, 50%), 38px 78px hsl(421.2, 100%, 50%), 36px 79px hsl(426.6, 100%, 50%), 35px 80px hsl(432, 100%, 50%), 33px 81px hsl(437.4, 100%, 50%), 32px 82px hsl(442.8, 100%, 50%), 30px 83px hsl(448.2, 100%, 50%), 28px 84px hsl(453.6, 100%, 50%), 27px 85px hsl(459, 100%, 50%), 25px 86px hsl(464.4, 100%, 50%), 23px 87px hsl(469.8, 100%, 50%), 22px 88px hsl(475.2, 100%, 50%), 20px 89px hsl(480.6, 100%, 50%), 18px 90px hsl(486, 100%, 50%), 16px 91px hsl(491.4, 100%, 50%), 14px 92px hsl(496.8, 100%, 50%), 13px 93px hsl(502.2, 100%, 50%), 11px 94px hsl(507.6, 100%, 50%), 9px 95px hsl(513, 100%, 50%), 7px 96px hsl(518.4, 100%, 50%), 5px 97px hsl(523.8, 100%, 50%), 3px 98px hsl(529.2, 100%, 50%), 1px 99px hsl(534.6, 100%, 50%), 7px 100px hsl(540, 100%, 50%), -1px 101px hsl(545.4, 100%, 50%), -3px 102px hsl(550.8, 100%, 50%), -5px 103px hsl(556.2, 100%, 50%), -7px 104px hsl(561.6, 100%, 50%), -9px 105px hsl(567, 100%, 50%), -11px 106px hsl(572.4, 100%, 50%), -13px 107px hsl(577.8, 100%, 50%), -14px 108px hsl(583.2, 100%, 50%), -16px 109px hsl(588.6, 100%, 50%), -18px 110px hsl(594, 100%, 50%), -20px 111px hsl(599.4, 100%, 50%), -22px 112px hsl(604.8, 100%, 50%), -23px 113px hsl(610.2, 100%, 50%), -25px 114px hsl(615.6, 100%, 50%), -27px 115px hsl(621, 100%, 50%), -28px 116px hsl(626.4, 100%, 50%), -30px 117px hsl(631.8, 100%, 50%), -32px 118px hsl(637.2, 100%, 50%), -33px 119px hsl(642.6, 100%, 50%), -35px 120px hsl(648, 100%, 50%), -36px 121px hsl(653.4, 100%, 50%), -38px 122px hsl(658.8, 100%, 50%), -39px 123px hsl(664.2, 100%, 50%), -41px 124px hsl(669.6, 100%, 50%), -42px 125px hsl(675, 100%, 50%), -43px 126px hsl(680.4, 100%, 50%), -45px 127px hsl(685.8, 100%, 50%), -46px 128px hsl(691.2, 100%, 50%), -47px 129px hsl(696.6, 100%, 50%), -48px 130px hsl(702, 100%, 50%), -49px 131px hsl(707.4, 100%, 50%), -50px 132px hsl(712.8, 100%, 50%), -51px 133px hsl(718.2, 100%, 50%), -52px 134px hsl(723.6, 100%, 50%), -53px 135px hsl(729, 100%, 50%), -54px 136px hsl(734.4, 100%, 50%), -55px 137px hsl(739.8, 100%, 50%), -55px 138px hsl(745.2, 100%, 50%), -56px 139px hsl(750.6, 100%, 50%), -57px 140px hsl(756, 100%, 50%), -57px 141px hsl(761.4, 100%, 50%), -58px 142px hsl(766.8, 100%, 50%), -58px 143px hsl(772.2, 100%, 50%), -58px 144px hsl(777.6, 100%, 50%), -59px 145px hsl(783, 100%, 50%), -59px 146px hsl(788.4, 100%, 50%), -59px 147px hsl(793.8, 100%, 50%), -59px 148px hsl(799.2, 100%, 50%), -59px 149px hsl(804.6, 100%, 50%), -60px 150px hsl(810, 100%, 50%), -59px 151px hsl(815.4, 100%, 50%), -59px 152px hsl(820.8, 100%, 50%), -59px 153px hsl(826.2, 100%, 50%), -59px 154px hsl(831.6, 100%, 50%), -59px 155px hsl(837, 100%, 50%), -58px 156px hsl(842.4, 100%, 50%), -58px 157px hsl(847.8, 100%, 50%), -58px 158px hsl(853.2, 100%, 50%), -57px 159px hsl(858.6, 100%, 50%), -57px 160px hsl(864, 100%, 50%), -56px 161px hsl(869.4, 100%, 50%), -55px 162px hsl(874.8, 100%, 50%), -55px 163px hsl(880.2, 100%, 50%), -54px 164px hsl(885.6, 100%, 50%), -53px 165px hsl(891, 100%, 50%), -52px 166px hsl(896.4, 100%, 50%), -51px 167px hsl(901.8, 100%, 50%), -50px 168px hsl(907.2, 100%, 50%), -49px 169px hsl(912.6, 100%, 50%), -48px 170px hsl(918, 100%, 50%), -47px 171px hsl(923.4, 100%, 50%), -46px 172px hsl(928.8, 100%, 50%), -45px 173px hsl(934.2, 100%, 50%), -43px 174px hsl(939.6, 100%, 50%), -42px 175px hsl(945, 100%, 50%), -41px 176px hsl(950.4, 100%, 50%), -39px 177px hsl(955.8, 100%, 50%), -38px 178px hsl(961.2, 100%, 50%), -36px 179px hsl(966.6, 100%, 50%), -35px 180px hsl(972, 100%, 50%), -33px 181px hsl(977.4, 100%, 50%), -32px 182px hsl(982.8, 100%, 50%), -30px 183px hsl(988.2, 100%, 50%), -28px 184px hsl(993.6, 100%, 50%), -27px 185px hsl(999, 100%, 50%), -25px 186px hsl(1004.4, 100%, 50%), -23px 187px hsl(1009.8, 100%, 50%), -22px 188px hsl(1015.2, 100%, 50%), -20px 189px hsl(1020.6, 100%, 50%), -18px 190px hsl(1026, 100%, 50%), -16px 191px hsl(1031.4, 100%, 50%), -14px 192px hsl(1036.8, 100%, 50%), -13px 193px hsl(1042.2, 100%, 50%), -11px 194px hsl(1047.6, 100%, 50%), -9px 195px hsl(1053, 100%, 50%), -7px 196px hsl(1058.4, 100%, 50%), -5px 197px hsl(1063.8, 100%, 50%), -3px 198px hsl(1069.2, 100%, 50%), -1px 199px hsl(1074.6, 100%, 50%), -1px 200px hsl(1080, 100%, 50%), 1px 201px hsl(1085.4, 100%, 50%), 3px 202px hsl(1090.8, 100%, 50%), 5px 203px hsl(1096.2, 100%, 50%), 7px 204px hsl(1101.6, 100%, 50%), 9px 205px hsl(1107, 100%, 50%), 11px 206px hsl(1112.4, 100%, 50%), 13px 207px hsl(1117.8, 100%, 50%), 14px 208px hsl(1123.2, 100%, 50%), 16px 209px hsl(1128.6, 100%, 50%), 18px 210px hsl(1134, 100%, 50%), 20px 211px hsl(1139.4, 100%, 50%), 22px 212px hsl(1144.8, 100%, 50%), 23px 213px hsl(1150.2, 100%, 50%), 25px 214px hsl(1155.6, 100%, 50%), 27px 215px hsl(1161, 100%, 50%), 28px 216px hsl(1166.4, 100%, 50%), 30px 217px hsl(1171.8, 100%, 50%), 32px 218px hsl(1177.2, 100%, 50%), 33px 219px hsl(1182.6, 100%, 50%), 35px 220px hsl(1188, 100%, 50%), 36px 221px hsl(1193.4, 100%, 50%), 38px 222px hsl(1198.8, 100%, 50%), 39px 223px hsl(1204.2, 100%, 50%), 41px 224px hsl(1209.6, 100%, 50%), 42px 225px hsl(1215, 100%, 50%), 43px 226px hsl(1220.4, 100%, 50%), 45px 227px hsl(1225.8, 100%, 50%), 46px 228px hsl(1231.2, 100%, 50%), 47px 229px hsl(1236.6, 100%, 50%), 48px 230px hsl(1242, 100%, 50%), 49px 231px hsl(1247.4, 100%, 50%), 50px 232px hsl(1252.8, 100%, 50%), 51px 233px hsl(1258.2, 100%, 50%), 52px 234px hsl(1263.6, 100%, 50%), 53px 235px hsl(1269, 100%, 50%), 54px 236px hsl(1274.4, 100%, 50%), 55px 237px hsl(1279.8, 100%, 50%), 55px 238px hsl(1285.2, 100%, 50%), 56px 239px hsl(1290.6, 100%, 50%), 57px 240px hsl(1296, 100%, 50%), 57px 241px hsl(1301.4, 100%, 50%), 58px 242px hsl(1306.8, 100%, 50%), 58px 243px hsl(1312.2, 100%, 50%), 58px 244px hsl(1317.6, 100%, 50%), 59px 245px hsl(1323, 100%, 50%), 59px 246px hsl(1328.4, 100%, 50%), 59px 247px hsl(1333.8, 100%, 50%), 59px 248px hsl(1339.2, 100%, 50%), 59px 249px hsl(1344.6, 100%, 50%), 60px 250px hsl(1350, 100%, 50%), 59px 251px hsl(1355.4, 100%, 50%), 59px 252px hsl(1360.8, 100%, 50%), 59px 253px hsl(1366.2, 100%, 50%), 59px 254px hsl(1371.6, 100%, 50%), 59px 255px hsl(1377, 100%, 50%), 58px 256px hsl(1382.4, 100%, 50%), 58px 257px hsl(1387.8, 100%, 50%), 58px 258px hsl(1393.2, 100%, 50%), 57px 259px hsl(1398.6, 100%, 50%), 57px 260px hsl(1404, 100%, 50%), 56px 261px hsl(1409.4, 100%, 50%), 55px 262px hsl(1414.8, 100%, 50%), 55px 263px hsl(1420.2, 100%, 50%), 54px 264px hsl(1425.6, 100%, 50%), 53px 265px hsl(1431, 100%, 50%), 52px 266px hsl(1436.4, 100%, 50%), 51px 267px hsl(1441.8, 100%, 50%), 50px 268px hsl(1447.2, 100%, 50%), 49px 269px hsl(1452.6, 100%, 50%), 48px 270px hsl(1458, 100%, 50%), 47px 271px hsl(1463.4, 100%, 50%), 46px 272px hsl(1468.8, 100%, 50%), 45px 273px hsl(1474.2, 100%, 50%), 43px 274px hsl(1479.6, 100%, 50%), 42px 275px hsl(1485, 100%, 50%), 41px 276px hsl(1490.4, 100%, 50%), 39px 277px hsl(1495.8, 100%, 50%), 38px 278px hsl(1501.2, 100%, 50%), 36px 279px hsl(1506.6, 100%, 50%), 35px 280px hsl(1512, 100%, 50%), 33px 281px hsl(1517.4, 100%, 50%), 32px 282px hsl(1522.8, 100%, 50%), 30px 283px hsl(1528.2, 100%, 50%), 28px 284px hsl(1533.6, 100%, 50%), 27px 285px hsl(1539, 100%, 50%), 25px 286px hsl(1544.4, 100%, 50%), 23px 287px hsl(1549.8, 100%, 50%), 22px 288px hsl(1555.2, 100%, 50%), 20px 289px hsl(1560.6, 100%, 50%), 18px 290px hsl(1566, 100%, 50%), 16px 291px hsl(1571.4, 100%, 50%), 14px 292px hsl(1576.8, 100%, 50%), 13px 293px hsl(1582.2, 100%, 50%), 11px 294px hsl(1587.6, 100%, 50%), 9px 295px hsl(1593, 100%, 50%), 7px 296px hsl(1598.4, 100%, 50%), 5px 297px hsl(1603.8, 100%, 50%), 3px 298px hsl(1609.2, 100%, 50%), 1px 299px hsl(1614.6, 100%, 50%), 2px 300px hsl(1620, 100%, 50%), -1px 301px hsl(1625.4, 100%, 50%), -3px 302px hsl(1630.8, 100%, 50%), -5px 303px hsl(1636.2, 100%, 50%), -7px 304px hsl(1641.6, 100%, 50%), -9px 305px hsl(1647, 100%, 50%), -11px 306px hsl(1652.4, 100%, 50%), -13px 307px hsl(1657.8, 100%, 50%), -14px 308px hsl(1663.2, 100%, 50%), -16px 309px hsl(1668.6, 100%, 50%), -18px 310px hsl(1674, 100%, 50%), -20px 311px hsl(1679.4, 100%, 50%), -22px 312px hsl(1684.8, 100%, 50%), -23px 313px hsl(1690.2, 100%, 50%), -25px 314px hsl(1695.6, 100%, 50%), -27px 315px hsl(1701, 100%, 50%), -28px 316px hsl(1706.4, 100%, 50%), -30px 317px hsl(1711.8, 100%, 50%), -32px 318px hsl(1717.2, 100%, 50%), -33px 319px hsl(1722.6, 100%, 50%), -35px 320px hsl(1728, 100%, 50%), -36px 321px hsl(1733.4, 100%, 50%), -38px 322px hsl(1738.8, 100%, 50%), -39px 323px hsl(1744.2, 100%, 50%), -41px 324px hsl(1749.6, 100%, 50%), -42px 325px hsl(1755, 100%, 50%), -43px 326px hsl(1760.4, 100%, 50%), -45px 327px hsl(1765.8, 100%, 50%), -46px 328px hsl(1771.2, 100%, 50%), -47px 329px hsl(1776.6, 100%, 50%), -48px 330px hsl(1782, 100%, 50%), -49px 331px hsl(1787.4, 100%, 50%), -50px 332px hsl(1792.8, 100%, 50%), -51px 333px hsl(1798.2, 100%, 50%), -52px 334px hsl(1803.6, 100%, 50%), -53px 335px hsl(1809, 100%, 50%), -54px 336px hsl(1814.4, 100%, 50%), -55px 337px hsl(1819.8, 100%, 50%), -55px 338px hsl(1825.2, 100%, 50%), -56px 339px hsl(1830.6, 100%, 50%), -57px 340px hsl(1836, 100%, 50%), -57px 341px hsl(1841.4, 100%, 50%), -58px 342px hsl(1846.8, 100%, 50%), -58px 343px hsl(1852.2, 100%, 50%), -58px 344px hsl(1857.6, 100%, 50%), -59px 345px hsl(1863, 100%, 50%), -59px 346px hsl(1868.4, 100%, 50%), -59px 347px hsl(1873.8, 100%, 50%), -59px 348px hsl(1879.2, 100%, 50%), -59px 349px hsl(1884.6, 100%, 50%), -60px 350px hsl(1890, 100%, 50%), -59px 351px hsl(1895.4, 100%, 50%), -59px 352px hsl(1900.8, 100%, 50%), -59px 353px hsl(1906.2, 100%, 50%), -59px 354px hsl(1911.6, 100%, 50%), -59px 355px hsl(1917, 100%, 50%), -58px 356px hsl(1922.4, 100%, 50%), -58px 357px hsl(1927.8, 100%, 50%), -58px 358px hsl(1933.2, 100%, 50%), -57px 359px hsl(1938.6, 100%, 50%), -57px 360px hsl(1944, 100%, 50%), -56px 361px hsl(1949.4, 100%, 50%), -55px 362px hsl(1954.8, 100%, 50%), -55px 363px hsl(1960.2, 100%, 50%), -54px 364px hsl(1965.6, 100%, 50%), -53px 365px hsl(1971, 100%, 50%), -52px 366px hsl(1976.4, 100%, 50%), -51px 367px hsl(1981.8, 100%, 50%), -50px 368px hsl(1987.2, 100%, 50%), -49px 369px hsl(1992.6, 100%, 50%), -48px 370px hsl(1998, 100%, 50%), -47px 371px hsl(2003.4, 100%, 50%), -46px 372px hsl(2008.8, 100%, 50%), -45px 373px hsl(2014.2, 100%, 50%), -43px 374px hsl(2019.6, 100%, 50%), -42px 375px hsl(2025, 100%, 50%), -41px 376px hsl(2030.4, 100%, 50%), -39px 377px hsl(2035.8, 100%, 50%), -38px 378px hsl(2041.2, 100%, 50%), -36px 379px hsl(2046.6, 100%, 50%), -35px 380px hsl(2052, 100%, 50%), -33px 381px hsl(2057.4, 100%, 50%), -32px 382px hsl(2062.8, 100%, 50%), -30px 383px hsl(2068.2, 100%, 50%), -28px 384px hsl(2073.6, 100%, 50%), -27px 385px hsl(2079, 100%, 50%), -25px 386px hsl(2084.4, 100%, 50%), -23px 387px hsl(2089.8, 100%, 50%), -22px 388px hsl(2095.2, 100%, 50%), -20px 389px hsl(2100.6, 100%, 50%), -18px 390px hsl(2106, 100%, 50%), -16px 391px hsl(2111.4, 100%, 50%), -14px 392px hsl(2116.8, 100%, 50%), -13px 393px hsl(2122.2, 100%, 50%), -11px 394px hsl(2127.6, 100%, 50%), -9px 395px hsl(2133, 100%, 50%), -7px 396px hsl(2138.4, 100%, 50%), -5px 397px hsl(2143.8, 100%, 50%), -3px 398px hsl(2149.2, 100%, 50%), -1px 399px hsl(2154.6, 100%, 50%); font-size: 40px;";
	// console.log('%c Made by Seth Kranzler and Cassie Tarakajian || http://sethkranzler.com || http://cassietarakajian.com', css);

	sampler = new Tone.Sampler({
		A : {
			1 : "sounds/vocals/1.mp3",
			2 : "sounds/vocals/2.mp3",
			3 : "sounds/vocals/3.mp3",
			4 : "sounds/vocals/4.mp3",
			5 : "sounds/vocals/5.mp3",
			6 : "sounds/vocals/6.mp3",
			7 : "sounds/vocals/7.mp3",
			8 : "sounds/vocals/8.mp3",
			9 : "sounds/vocals/9.mp3",
			10 : "sounds/vocals/10.mp3"
		}
	}).toMaster();
	sampler.volume.value = -5;
	if (window.innerWidth >= MOBILE_MAX_WIDTH) {
		isMobile = false;
			var maskCanvas = document.getElementById('myCanvas');
			animationCanvas = document.getElementById('animationCanvas');

			maskCanvas.width = $("#myCanvas").width();
			maskCanvas.height = $("#myCanvas").width();
			animationCanvas.width = $("#animationCanvas").width();
			animationCanvas.height = $("#animationCanvas").width();
			var renderer = new PIXI.autoDetectRenderer(animationCanvas.width, animationCanvas.height, {
				view: animationCanvas,
				transparent: true
			});

			var fadeInInc = 0.1;
			var fadeOutInc = 0.01;
			function animate() {
				renderer.render(stage);
				for(var i = 0; i < 10; i ++){
					if(glowOutlines[i].isFadingIn){
						glowOutlines[i].sprite.alpha += fadeInInc;
						if(glowOutlines[i].sprite.alpha > 1){
							glowOutlines[i].sprite.alpha = 1;
							glowOutlines[i].isFadingIn = false;
						}
					}
					if(glowOutlines[i].isFadingOut){
						glowOutlines[i].sprite.alpha -= fadeOutInc;
						if(glowOutlines[i].sprite.alpha < 0){
							glowOutlines[i].sprite.alpha = 0;
							glowOutlines[i].isFadingOut = false;
						}
					}
				}
				requestAnimationFrame(animate);
			}

			for(var i = 0; i < 10; i ++) {
				glowOutlines[i] = new glowOutline(i);
			}
			animate();

			var maskContext = maskCanvas.getContext('2d');
			maskContext.globalAlpha = 0.01;
			var mask = new Image();
			mask.src = "images/mask.png";
			mask.onload = function() {
				maskContext.drawImage(mask, 0, 0, maskCanvas.width, maskCanvas.height);
			};

			maskCanvas.onmousemove=function(e){
				handleMouseover(maskContext.getImageData(e.offsetX, e.offsetY, 1, 1).data);
				// console.log("this is the current mouse" + currentMouse);
			};

			$(window).keydown(function(e) {
				handleKeydown(e.keyCode);
			});
	} 

	buff = new Tone.Buffer("sounds/NBLY_Chorus.mp3", function(){
		instrumental = new Tone.Player({'loop': true}).toMaster();
		instrumental.buffer = buff.get();
		instrumental.sync();
	});

	var buttonCanvas = document.getElementById("button-canvas");
	buttonCanvas.width = window.innerWidth;
	buttonCanvas.height = window.innerHeight;
	buttonWidth = window.innerWidth/2;
	buttonHeight = window.innerHeight/5;

	buttonContext = buttonCanvas.getContext('2d');

	buttonCanvas.ontouchstart = function(e) {
		handleButtonOnTouchStart(e);
		return false;
	};

	buttonCanvas.onmousedown = function(e) {
		handleButtonClick(e.clientX, e.clientY);
		resetInactivityTimeout();
	}

	buttonCanvas.ontouchmove = function(e) {
		handleButtonOnTouchMove(e);
		return false;
	};

	// buttonCanvas.onmousemove = function(e) {
	// 	handleButtonMove(e.clientX, e.clientY);
	// 	resetInactivityTimeout();
	// }

	buttonCanvas.ontouchend = function(e) {
		handleButtonOnTouchEnd(e);
	};

	buttonCanvas.onmouseup = function(e) {
		handleButtonOnTouchEnd(e);
	}

	document.body.ontouchstart = function(e) {
		handleDocumentOnTouchStart(e);
		if (e.target.id === "content") {
			handleContentOnTouchStart(e);
		}
		else if (e.target.id === "facebook" || e.target.id === "twitter") {
			return true;
		}
		return false;
	};

	document.body.onclick = function(e) {
		if (window.innerWidth < MOBILE_MAX_WIDTH) {
			// console.log("document on click");
			handleDocumentOnTouchStart(e);
			if (e.target.id === "content") {
				handleContentOnTouchStart(e);
			}
		}
	}

	$(".instrument__start-button").click(function() {
		startMusic();
		$(this).addClass("hidden");
		$(".instrument__stop-button").removeClass("hidden");
		if (window.innerWidth >= MOBILE_MAX_WIDTH) {
			for (var i = 0; i < 10; i++) {
				setTimeout(function(k) {
					glowOutlines[k].fadeIn();
				}.bind(this, i), 2*i*50);
				setTimeout(function(j) {
					glowOutlines[j].fadeOut();
				}.bind(this, i), 2*(i+1)*50);
			}
			$(".instrument__help-text").removeClass("hidden");
			$(".instrument__help-text").addClass("animate-flicker");
			setTimeout(function() {
				$(".instrument__help-text").removeClass("animate-flicker");
				$(".instrument__help-text").addClass("hidden");
			}, 10000);
		}
	});

	$(".instrument__stop-button").click(function() {
		stopMusic();
		$(this).addClass("hidden");
		$(".instrument__play-button").removeClass("hidden");
	});

	$(".instrument__play-button").click(function() {
		startMusic();
		$(this).addClass("hidden");
		$(".instrument__stop-button").removeClass("hidden");
	});
};

function handleButtonOnTouchEnd(e) {
	if(instrumentalInitilizer != true){
		startMusic();
		instrumentalInitilizer = false;
	}
	lastButtonX = -1;
	lastButtonY = -1;
}

function handleButtonOnTouchMove(e) {
	for (var i = 0; i < e.changedTouches.length; i++) {
		var x = e.changedTouches[i].clientX;
		var y = e.changedTouches[i].clientY;
		handleButtonMove(x, y);
	}
	resetInactivityTimeout();
}

function handleButtonOnTouchStart(e) {
	for (var i = 0; i < e.touches.length; i++) {
		var x = e.touches[i].clientX;
		var y = e.touches[i].clientY;
		handleButtonClick(x, y);
	}
	resetInactivityTimeout();
}

function handleContentOnTouchStart(e) {
	// console.log("content touch");
	if (isInstrumentalPlaying) {
		stopMusic();
		$(".header__flash-content").text("Start Track");
		isInstrumentalPlaying = false;
	}
	else if (trackPlayedOnce) {
		startMusic();
		$(".header__flash-content").text("Stop Track");
		isInstrumentalPlaying = true;
	}
}

function handleDocumentOnTouchStart(e) {
	// console.log("document on touch start");
	if (!$(".header").hasClass("hidden") && e.target.id !== "content" && $(".loader").hasClass("hidden") 
			&& e.target.id !== "facebook" && e.target.id !== "twitter") {
		$(".header").addClass("hidden");
		$(".playlist").addClass("hidden");
		$(".share").addClass("hidden");
		$(".instrument__buttons").addClass("bring-to-front");

		if (!isInstrumentalPlaying && !trackPlayedOnce) {
			$(".header__flash").removeClass("animate-flicker");
			startMusic();
			$(".header__flash-content").text("Stop Track");
			$(".header__flash-content").css("border", "2px solid white");
			isInstrumentalPlaying = true;
			trackPlayedOnce = true;
		}

		resetInactivityTimeout();
	}
}

function handleKeydown(keyCode) {
	switch(keyCode) {
		case 65: //a
			schedulePlay(1);
			glowOutlines[0].fadeIn();
			setTimeout(function() {glowOutlines[0].fadeOut();}, 500);
			break;
		case 83: //s
			schedulePlay(2);
			glowOutlines[1].fadeIn();
			setTimeout(function() {glowOutlines[1].fadeOut();}, 500);
			break;
		case 68: //d
			schedulePlay(3);
			glowOutlines[2].fadeIn();
			setTimeout(function() {glowOutlines[2].fadeOut();}, 500);
			break;
		case 70: //f
			schedulePlay(4);
			glowOutlines[3].fadeIn();
			setTimeout(function() {glowOutlines[3].fadeOut();}, 500);
			break;
		case 71: //g
			schedulePlay(5);
			glowOutlines[4].fadeIn();
			setTimeout(function() {glowOutlines[4].fadeOut();}, 500);
			break;
		case 72: //h
			schedulePlay(6);
			glowOutlines[5].fadeIn();
			setTimeout(function() {glowOutlines[5].fadeOut();}, 500);
			break;
		case 74: //j
			schedulePlay(7);
			glowOutlines[6].fadeIn();
			setTimeout(function() {glowOutlines[6].fadeOut();}, 500);
			break;
		case 75: //k
			schedulePlay(8);
			glowOutlines[7].fadeIn();
			setTimeout(function() {glowOutlines[7].fadeOut();}, 500);
			break;
		case 76: //l
			schedulePlay(9);
			glowOutlines[8].fadeIn();
			setTimeout(function() {glowOutlines[8].fadeOut();}, 500);
			break;
		case 90: //z
			schedulePlay(10);
			glowOutlines[9].fadeIn();
			setTimeout(function() {glowOutlines[9].fadeOut();}, 500);
			break;
		case 88: //x
			schedulePlay(11);
			glowOutlines[10].fadeIn();
			setTimeout(function() {glowOutlines[10].fadeOut();}, 500);
			break;
		case 67: //c
			schedulePlay(12);
			glowOutlines[11].fadeIn();
			setTimeout(function() {glowOutlines[11].fadeOut();}, 500);
			break;
		case 86: //v
			schedulePlay(13);
			glowOutlines[12].fadeIn();
			setTimeout(function() {glowOutlines[12].fadeOut();}, 500);
			break;
		case 66: //b
			schedulePlay(14);
			glowOutlines[13].fadeIn();
			setTimeout(function() {glowOutlines[13].fadeOut();}, 500);
			break;
		default:
			break;
	}
}

function resetInactivityTimeout() {
	clearTimeout(inactivityTimeout);

	inactivityTimeout  = setTimeout(function() {
		$(".header").removeClass("hidden");
		$(".playlist").removeClass("hidden");
		$(".share").removeClass("hidden");
		$(".instrument__buttons").removeClass("bring-to-front");
	}, 3000);
}

function handleButtonClick(x, y) {
	// console.log(x + ", " + y);
	
	var buttonX = Math.floor(x / buttonWidth);
	var buttonY = Math.floor(y / buttonHeight);

	lastButtonX = buttonX;
	lastButtonY = buttonY;	
	drawButton(buttonX, buttonY);
	playVocalSound(buttonX, buttonY);
}

function handleButtonMove(x, y) {
	var buttonX = Math.floor(x / buttonWidth);
	var buttonY = Math.floor(y / buttonHeight);

	if (buttonX !== lastButtonX || buttonY !== lastButtonY) {
		lastButtonX = buttonX;
		lastButtonY = buttonY;	

		drawButton(buttonX, buttonY);
		playVocalSound(buttonX, buttonY);
	}
}

function drawButton(buttonX, buttonY) {
	buttonContext.fillStyle = 'rgba(255, 255, 255, 0.3)';
	buttonContext.fillRect(buttonX*buttonWidth, buttonY*buttonHeight, buttonWidth, buttonHeight);
	setTimeout(function() {
		buttonContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
	}, 100);
}

function playVocalSound(buttonX, buttonY) {
	if (buttonX === 0) {
		switch(buttonY) {
			case 0:
				schedulePlay(1);
				break;
			case 1:
				schedulePlay(4);
				break;
			case 2:
				schedulePlay(5);
				break;
			case 3:
				schedulePlay(8);
				break;
			case 4:
				schedulePlay(9);
				break;
			case 5:
				schedulePlay(12);
				break;
			case 6:
				schedulePlay(13);
				break;
		}
	}
	else {
		switch(buttonY) {
			case 0:
				schedulePlay(2);
				break;
			case 1:
				schedulePlay(3);
				break;
			case 2:
				schedulePlay(6);
				break;
			case 3:
				schedulePlay(7);
				break;
			case 4:
				schedulePlay(10);
				break;
			case 5:
				schedulePlay(11);
				break;
			case 6:
				schedulePlay(14);
				break;
		}
	}
}

var currentMouse = 0;

function handleMouseover(color){
	color = color[0].toString() + color[1].toString() + color[2].toString();
	console.log(color);
	switch(color) {
		case "000":
			if(currentMouse !== 0) {
				for(var i = 0; i < 10; i ++){
					glowOutlines[i].fadeOut();
				}
				sampler.triggerRelease(Tone.context.currentTime);
			}
			currentMouse = 0;
			break;
		case "255255255":
			schedulePlay(1);
			currentMouse = 1;
			break;
		case "2552550":
			schedulePlay(2);
			currentMouse = 2;
			break;
		case "2550255":
			schedulePlay(3);
			currentMouse = 3;
			break;
		case "0255255":
			schedulePlay(4);
			currentMouse = 4;
			break;
		case "25500":
			schedulePlay(5);
			currentMouse = 5;
			break;
		case "00255":
			schedulePlay(6);
			currentMouse = 6;
			break;
		case "02550":
			schedulePlay(7);
			currentMouse = 7;
			break;
		case "85850":
			schedulePlay(8);
			currentMouse = 8;
			break;
		case "858585":
			schedulePlay(9);
			currentMouse = 9;
			break;
		case "85085":
			schedulePlay(10);
			currentMouse = 10;
			break;
		case "8500":
			schedulePlay(12);
			currentMouse = 12;
			break;
		case "0085":
			schedulePlay(13);
			currentMouse = 13;
			break;
		case "0850":
			schedulePlay(14);
			currentMouse = 14;
			break;
	}
}

function schedulePlay(num){
	if(currentMouse !== 0 && currentMouse !== null){
		for(var i = 0; i < 10; i ++){
			if(i != (num - 1)) glowOutlines[i].fadeOut();
		}
		glowOutlines[num - 1].fadeIn();
	}
	if(currentMouse != num){
		var nextNote = Math.floor(Tone.context.currentTime / 0.125);
		nextNote = nextNote * 0.125 + 0.125;
		sampler.triggerRelease(nextNote);
		sampler.triggerAttack("A." + num, nextNote);
	}
}

function startMusic(){
	if(Tone.Transport.state !== "started"){
		Tone.Transport.start();
	}
	instrumental.start();
}

function stopMusic(){
	instrumental.stop();
}

var instLoad = false;
Tone.Buffer.on("load", function(){
	// console.log("the buffer has loaded");
	if(!instLoad){
		$(".loader").addClass("hidden");
		instLoad = true;
	}
});
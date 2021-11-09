import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  text: {textAlign: 'center', fontSize: width * 0.03},
  currentReadContainer: {
    width: width,
    alignItems: 'center',
    marginVertical: width * 0.05,
    height: height * 0.15,
  },
  meterTypeImg: {
    height: height * 0.09,
    width: height * 0.09,
  },
  flexRow: {flexDirection: 'row'},
  flexColumn: {flexDirection: 'column'},
  centerIcon: {alignSelf: 'center'},
  dangerBtn: {
    backgroundColor: '#e24b4b',
    marginBottom: height * 0.03,
  },
  imgHeader: {
    height: width * 0.06,
    width: width * 0.055,
    marginRight: width * 0.025,
  },
  headerContainer: {
    borderBottomWidth: width * 0.003,
    elevation: 1,
  },
  listOuter: {paddingVertical: width * 0.02},
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listText: {textAlign: 'center', fontSize: width * 0.04},
  listGreyText: {color: '#5c5c5ccf', fontSize: width * 0.04},
  listDivider: {
    marginTop: height * 0.02,
    borderWidth: 0.2,
    width: width * 0.9,
    flexDirection: 'row',
  },
  listInner: {backgroundColor: '#605c5c24'},
  listInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: width * 0.04,
  },
  listInnerText: {fontSize: width * 0.035},

  currentReadInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width,
    marginVertical: width * 0.01,
    paddingHorizontal: width * 0.04,
  },
  greyText: {color: '#5c5c5ccf', fontSize: width * 0.03},
  symbolStyle: {
    marginHorizontal: width * 0.02,
    color: '#5c5c5ccf',
  },
  sectionStyle: {marginTop: height * 0.07},
  sectionContainer: {
    width: width,
    paddingHorizontal: width * 0.05,
  },
  sectionText: {fontSize: width * 0.065},
  sectionTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleDivider: {
    marginBottom: height * 0.02,
    marginTop: height * 0.01,
    width: width * 0.9,
    borderWidth: 0.8,
  },
  sectionImgStyle: {
    height: height * 0.08,
    width: height * 0.08,
  },
  statusList: {width: width * 0.9, bottom: width * 0.02},
  usageTextContainer: {
    flexDirection: 'row',
    marginTop: height * 0.07,
    width: width,
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    alignItems: 'center',
  },
  chartStyle: {
    height: height * 0.3,
    width: width * 0.9,
  },
  chartPadding: {left: 40, bottom: 20, right: 20, top: 20},
  legendContainer: {flexDirection: 'row', alignSelf: 'center'},
  meterUsageBox: {
    backgroundColor: '#DFDFDF',
    width: width * 0.03,
    height: width * 0.03,
    alignSelf: 'center',
    marginHorizontal: width * 0.02,
  },
  meterReadBox: {
    backgroundColor: '#5D84B6',
    width: width * 0.03,
    height: width * 0.03,
    alignSelf: 'center',
    marginHorizontal: width * 0.02,
  },
  dangerHeader: {
    marginVertical: height * 0.02,
    width: width * 0.9,
    borderWidth: 0.8,
    left: width * 0.05,
  },
  dangerView: {
    flexDirection: 'column',
    width: width * 0.9,
    alignSelf: 'center',
    marginBottom: width * 0.05,
  },
});

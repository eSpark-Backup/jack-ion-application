import React from 'react';
import {
    View,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import { Fonts } from '../../utils/fonts';

//Packages
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import TextTicker from 'react-native-text-ticker';

// Components
import TextReuseableComponent from '../../components/Text/index';

const { width, height } = Dimensions.get('window');

const Properties = ({
    prop,
    routerIcon,
    warningIcon,
    jumpFromSearch,
    selectedProp,
    currentIndex,
    jumpToDetail,
    jumpToEquip,
    jumpToAlerts,
    confirmDelete
}) => {
    return <>
        <TouchableOpacity
            style={[
                styles.propButton, selectedProp !== null && {
                    borderBottomLeftRadius:
                        prop?.index === currentIndex ? 0 : width * 0.008,
                    borderBottomRightRadius:
                        prop?.index === currentIndex ? 0 : width * 0.008,
                }
            ]}
            onPress={jumpFromSearch ? () => jumpFromSearch({ prop, item: prop }) : () => selectedProp(prop)}>
            <MaterialCommunityIcons
                name="home-city-outline"
                size={width * 0.09}
                style={{ marginHorizontal: 15 }}
                color="#115b72"
            />
            <View style={{ width: width * 0.5, position: 'absolute', left: width * 0.16 }}>
                <View style={{ width: width * 0.5 }}>
                    <TextTicker
                        style={styles.propText}
                        duration={6000}
                        marqueeDelay={2000}
                        repeatSpacer={width * 0.5}>
                        {prop?.item?.name == null ? 'Untitled' : prop?.item?.name}
                    </TextTicker>
                </View>
                <View style={{
                    width: width * 0.55,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Icon name="ios-location-outline"
                        size={height * 0.02}
                        color="gray"
                    />
                    <TextTicker
                        style={{ color: 'gray' }}
                        duration={6000}
                        marqueeDelay={2000}
                        repeatSpacer={width * 0.5}>
                        {
                            (prop?.item?.city == null ? '' : prop?.item?.city + ', ') +
                            (prop?.item?.st == null ? '' : prop?.item?.st)
                        }
                    </TextTicker>
                </View>
            </View>
            <View style={{ flexDirection: 'row', marginHorizontal: 15, justifyContent: 'flex-end' }}>
                <View style={styles.buildUnitCountContainer}>
                    <FontAwesome5Icon
                        name="building"
                        size={width * 0.04}
                        color="#115b72"
                    />
                    <TextReuseableComponent title style={styles.buildUnitCount} value={prop?.item?.building_count} />
                </View>
                <View style={styles.buildUnitCountContainer}>
                    <FontAwesome5Icon
                        name="house-user"
                        size={width * 0.04}
                        color="#115b72"
                    />
                    <TextReuseableComponent title style={styles.buildUnitCount} value={prop?.item?.unit_actual_count} />
                </View>
                {prop?.item?.gateway && routerIcon &&
                    <View style={styles.buildUnitCountContainer}>
                        <MaterialIcon
                            name="router"
                            size={width * 0.05}
                            color="#115b72"
                        />
                    </View>
                }
            {warningIcon && <View style={styles.buildUnitCountContainer}>
                    <MaterialIcons
                        name="warning"
                        size={width * 0.04}
                        color="#115b72"
                    />
                    <TextReuseableComponent title style={styles.buildUnitCount} value={prop.item.alert_count} />
                </View>}
            </View>
        </TouchableOpacity>
        {prop.index === currentIndex ? (
            <View>
                <View
                    style={styles.animatedDetailView}>
                    <View>
                        <View style={styles.animatedDetailShown}>
                            <Icon name="ios-location-outline"
                                size={height * 0.025}
                                color="black"
                            />
                            <TextTicker
                                style={{ color: 'black', fontSize: height * .015 }}
                                duration={6000}
                                marqueeDelay={2000}
                                repeatSpacer={width * 0.7}>
                                {
                                    (prop?.item?.city == null ? '' : prop?.item?.city + ' , ') +
                                    (prop?.item?.st == null ? '' : prop?.item?.st + ' , ') +
                                    (prop?.item?.street == null ? '' : prop?.item?.street + ' , ') +
                                    (prop?.item?.zipcode == null ? '' : prop?.item?.zipcode)
                                }
                            </TextTicker>
                        </View>
                        <View style={styles.animatedDetailShown1}>
                            <View style={styles.animatedDetailBuildingAndUnit}>
                                <FontAwesome5Icon
                                    name="building"
                                    size={height * 0.02}
                                    color="#000"
                                />
                                <TextReuseableComponent title style={{ marginHorizontal: 4 }} value={"Building:"} />
                                <TextReuseableComponent title style={styles.animatedDetailBuildingAndUnitText} value={prop?.item?.building_count} />
                            </View>
                            <View style={styles.animatedDetailBuildingAndUnit}>
                                <FontAwesome5Icon
                                    name="house-user"
                                    size={height * 0.02}
                                    color="#000"
                                />
                                <TextReuseableComponent title style={{ marginHorizontal: 4 }} value={"Unit:"} />
                                <TextReuseableComponent title style={styles.animatedDetailBuildingAndUnitText} value={prop?.item?.unit_actual_count} />
                            </View>
                        </View>

                        <View style={styles.animatedDetailShown1}>
                            <View style={styles.animatedDetailBuildingAndUnit}>
                                <Feather
                                    name="inbox"
                                    size={width * 0.04}
                                    color="#000"
                                />
                                <TextReuseableComponent title style={{ marginHorizontal: 4 }} value={"Meter:"} />
                                <TextReuseableComponent title style={styles.animatedDetailBuildingAndUnitText} value={prop?.item?.meter_count} />
                            </View>
                            <View style={styles.animatedDetailBuildingAndUnit}>
                                <MaterialCommunityIcons
                                    name="file-table-box-outline"
                                    size={width * 0.04}
                                    color="#000"
                                />
                                <TextReuseableComponent title style={{ marginHorizontal: 4 }} value={"Unit Mix:"} />
                                <TextReuseableComponent title style={styles.animatedDetailBuildingAndUnitText} value={prop?.item?.unit_mix_count} />
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.animatedView}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={styles.animatedViewDetailBtn}
                            onPress={() => jumpToDetail({ prop, item: prop })}>
                            <MaterialCommunityIcons
                                name="view-compact-outline"
                                color="white"
                                size={width * 0.04}
                            />
                            <TextReuseableComponent title style={styles.animatedViewDetailBtnName} value={"Details"} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => jumpToEquip({ prop, item: prop })}
                            style={styles.animatedViewDetailBtn}>
                            <MaterialIcons name="edit" color="white" size={width * 0.04} />
                            <TextReuseableComponent title style={styles.animatedViewDetailBtnName} value={"Equipments"} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => jumpToAlerts({ prop, item: prop })}
                            style={styles.animatedViewDetailBtn}>
                            <Feather
                                name="alert-triangle"
                                color="white"
                                size={width * 0.04}
                            />
                            <TextReuseableComponent title style={styles.animatedViewDetailBtnName} value={"Alerts"} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={() => confirmDelete(prop?.item?.id)}
                        style={styles.animatedViewDetailBtn}>
                        <MaterialCommunityIcons
                            name="delete-outline"
                            color="white"
                            size={width * 0.04}
                        />
                        <TextReuseableComponent title style={styles.animatedViewDetailBtnName} value={"Delete"} />
                    </TouchableOpacity>
                </View>
            </View>

        ) : null}
    </>

}

const styles = StyleSheet.create({
    propButton: {
        height: height * 0.09,
        width: width * 0.9,
        backgroundColor: 'white',
        borderColor: '#115b72',
        borderWidth: width * 0.001,
        borderRadius: width * 0.008,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    buildUnitCountContainer: {
        alignItems: 'center',
        marginHorizontal: width * 0.01,
    },
    buildUnitCount: {
        fontSize: width * 0.035,
        color: '#001522',
        textShadowRadius: width * 0.005,
        textShadowColor: '#09BAF2',
    },
    animatedDetailView: {
        width: width * 0.9,
        alignItems: 'center',
        backgroundColor: '#ffffff50',
        // borderBottomLeftRadius: width * 0.01,
        // borderBottomRightRadius: width * 0.01,
        borderWidth: width * 0.001,
    },
    animatedDetailShown: {
        borderBottomWidth: height * .0003,
        width: width * 0.9,
        height: height * .05,
        borderColor: 'black',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: height * .01
    },
    animatedDetailShown1: {
        borderBottomWidth: height * .0003,
        width: width * 0.9,
        height: height * .05,
        borderColor: 'black',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingLeft: height * .01
    },
    animatedDetailBuildingAndUnit: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: height * .01,
    },
    animatedDetailBuildingAndUnitText: {
        fontFamily: Fonts.Montserrat,
        fontSize: height * 0.015,
        color: '#001522',
        marginLeft: height * .01,

    },
    animatedView: {
        flexDirection: 'row',
        width: width * 0.9,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: width * 0.01,
        backgroundColor: '#25AAE1ec',
        borderBottomLeftRadius: width * 0.01,
        borderBottomRightRadius: width * 0.01,
        // borderWidth: width * 0.001,
    },
    animatedViewDetailBtn: {
        margin: width * 0.01,
        flexDirection: 'row',
        alignItems: 'center',
    },
    animatedViewDetailBtnName: {
        color: 'white',
        fontFamily: Fonts.Montserrat,
        fontSize: width * 0.03,
    },
});

export default Properties;
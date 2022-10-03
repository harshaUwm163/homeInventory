import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Touchable, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Slider} from '@miblanchard/react-native-slider';

const COLORS = {primary: '#1f145c', white: '#fff', blue: '0000ff'}

const App = () => {
  const [sliderRange, setSliderRange] = React.useState(0);
  const [textInput, setTextInput] = React.useState('');
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    getItemsFromUserDevice();
    },
    []
  );
  React.useEffect(()=>{
    saveItemsToUserDevice(items);
    },
    [items]
  );

  const ListItem= ({item}) => {
    return <View>
    <View style={styles.listItem}>
      <View style={{flex: 1}}>
        <Text style={{fontWeight: 'bold', fontSize: 15, color: COLORS.primary, textDecorationLine: item?.completed?'line-through': 'none'}}>
          {item?.task}
        </Text>
      </View>
      {
        !item?.completed && (
          <TouchableOpacity style={[styles.actionIcon]} onPress={() => markItenComplete(item?.id)}>
            <Icon name="done" size={20} color={COLORS.white} />
          </TouchableOpacity>
        )
      }
      <TouchableOpacity style={[styles.actionIcon, {backgroundColor: 'red'}]} onPress={() => deleteItem(item?.id)}>
        <Icon name="delete" size={20} color={COLORS.white} />
      </TouchableOpacity>
    </View>
    <View style={[styles.slider]}>
      <Text style={{fontSize:20, fontWeight:"bold"}}>{Math.floor(item?.quantity*100)} %</Text>
    <Slider
      value={item?.quantity}
      onSlidingComplete={value => {updateItemQuantity(item?.id,value); }}
      animateTransitions={true}
      animationType = {'spring'}
    />
    </View>
    </View>;
  };

  const saveItemsToUserDevice = async items =>{
    try {
      const stringifyItems = JSON.stringify(items);
      await AsyncStorage.setItem('items', stringifyItems);
    }
    catch (e) {
      console.log(e);
    }
  };

  const getItemsFromUserDevice = async () => {
    try{
      const items = await AsyncStorage.getItem("items");
      if(items != null)
      {
        setItems(JSON.parse(items));
      }
    }
    catch (e) {
      console.log(e);
    }
  };

  const addItem = () => {
    if(textInput == ""){
      Alert.alert("Error", "Please input the name of the item")
    }
    else
    {
      const newItem ={
        id:Math.random(),
        task: textInput,
        completed:false,
        quantity:0,
      };
      setItems([...items, newItem]);
      setTextInput('')
    }
  };

  const markItenComplete = itemId => {
    const newItems = items.map((item)=>{
      if(item.id == itemId){
        return {...item, completed:true}
      }
      return item;
    });
    setItems(newItems);
  };

  const deleteItem = itemId => {
    const newItems = items.filter(item => item.id != itemId);
    setItems(newItems);
  };

  const clearItems = () => {
    Alert.alert("Confirm", "Clear Items?", [
      {
        text:"Yes", 
        onPress: () => setItems([]),
      },
      {
        text:"No",
      }
    ]);
    
  }

  const updateItemQuantity= (itemId,itemQuant) => {
    const newItems = items.map((item)=>{
      if(item.id == itemId){
        return {...item, quantity:itemQuant};
      }
      return item;
    });
    setItems(newItems);
  };

  return (
  <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
    <View style={styles.header}>
    <Text style={{fontWeight: 'bold', fontSize: 20, color: COLORS.primary}}> HOME INVENTORY</Text>
    <Icon name="delete" size={25} color="red" onPress={() =>clearItems()}/>
    </View>
    
    <FlatList 
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{padding: 20, paddingBottom: 100}}
    data={items} 
    renderItem={({item}) => <ListItem item={item}/>}
    />

    <View style={styles.footer}>
      <View style={styles.inputContainer}>
        <TextInput 
          placeholder='Add item'
          value = {textInput}
          onChangeText={text => setTextInput(text)}  />
      </View>
      <TouchableOpacity onPress={addItem}>
        <View style={styles.iconContainer}>
          <Icon name="add-circle" color="blue" size={50} />
        </View>
      </TouchableOpacity>
    </View>

  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 40,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    color: COLORS.white,
    backgroundColor: COLORS.white,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  inputContainer:{
    backgroundColor: COLORS.white,
    elevation: 40,
    flex: 1,
    height: 50,
    marginVertical: 20,
    justifyContent: 'center',
    marginRight: 20,
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  iconContainer:{
    height: 50,
    width: 50,
    borderRadius: 25,
    elevation: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    elevation: 20,
    borderRadius: 7,
    marginVertical: 10,
  },
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    borderRadius: 3,
  },
  slider: {
  },
});

export default App;

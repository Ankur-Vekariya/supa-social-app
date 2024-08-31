import { Alert, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Button from '../../components/Button'
import { useAuth } from "../../context/AuthContext";
import { supabase } from '../../lib/supabase';

const Home = () => {
const {setAuth} = useAuth()
  const signOut = () => {
    setAuth(null)
    const {error} = supabase.auth.signOut()
    if (error) {
      Alert.alert("Sign Out", error.message)
    }
  }
  return (
    <ScreenWrapper>
      <Text>Home</Text>
      <Button title='Log out' onPress={signOut}/>
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({})
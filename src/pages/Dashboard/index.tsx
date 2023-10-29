import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { FoodInfo } from '../../models/FoodInfo';

interface DashboardState {
  foods: FoodInfo[];
  editingFood: FoodInfo;
  modalOpen: boolean;
  editModalOpen: boolean;
}

const Dashboard = () => {
  const [dashboardState, setDashboard] = useState<DashboardState>({
    foods: [],
    editingFood: {} as FoodInfo,
    modalOpen: false,
    editModalOpen: false
  });

  useEffect(() => {
    api.get('/foods').then(response => {
      setDashboard({ ...dashboardState, foods: response.data });
    });
  }, []);

  const handleAddFood = async (food: FoodInfo) => {
    const { foods } = dashboardState;

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setDashboard((state) => ({ ...state, foods: [...foods, response.data] }));
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: FoodInfo) => {
    const { foods, editingFood } = dashboardState;

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setDashboard(state => ({ ...state, foods: foodsUpdated }));
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {
    const { foods } = dashboardState;

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setDashboard(state => ({ ...state, foods: foodsFiltered }));
  }

  const toggleModal = () => {
    const { modalOpen } = dashboardState;

    setDashboard(state => ({ ...state, modalOpen: !modalOpen }));
  }

  const toggleEditModal = () => {
    const { editModalOpen } = dashboardState;

    setDashboard(state => ({ ...state, editModalOpen: !editModalOpen }));
  }

  const handleEditFood = (food: FoodInfo) => {
    setDashboard(state => ({ ...state, editingFood: food, editModalOpen: true }));
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={dashboardState.modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={dashboardState.editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={dashboardState.editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {dashboardState.foods &&
          dashboardState.foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;
